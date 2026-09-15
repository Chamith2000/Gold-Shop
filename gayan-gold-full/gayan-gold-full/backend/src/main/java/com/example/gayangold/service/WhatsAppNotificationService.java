package com.example.gayangold.service;

import com.example.gayangold.config.WhatsAppProperties;
import com.example.gayangold.entity.OrderEntity;
import com.example.gayangold.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppNotificationService {

    private static final int MAX_ATTEMPTS = 3;
    private static final int MAX_ITEM_SUMMARY_LENGTH = 900;

    private final RestClient whatsappRestClient;
    private final WhatsAppProperties properties;

    public void sendOrderCreatedNotification(OrderEntity order) {
        if (!properties.isConfigured()) {
            log.debug("WhatsApp order notification is disabled or not fully configured");
            return;
        }

        Map<String, Object> request = buildTemplateRequest(order);
        String endpoint = String.format(
                "https://graph.facebook.com/%s/%s/messages",
                properties.getApiVersion(),
                properties.getPhoneNumberId());

        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                whatsappRestClient.post()
                        .uri(endpoint)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + properties.getAccessToken())
                        .body(request)
                        .retrieve()
                        .toBodilessEntity();

                log.info("WhatsApp order notification sent successfully for order {}", order.getOrderNumber());
                return;
            } catch (RestClientResponseException ex) {
                log.warn(
                        "WhatsApp order notification failed for order {} (attempt {}/{}): HTTP {}",
                        order.getOrderNumber(), attempt, MAX_ATTEMPTS, ex.getStatusCode().value());
            } catch (RuntimeException ex) {
                log.warn(
                        "WhatsApp order notification failed for order {} (attempt {}/{}): {}",
                        order.getOrderNumber(), attempt, MAX_ATTEMPTS, ex.getMessage());
            }

            if (attempt < MAX_ATTEMPTS) {
                sleepBeforeRetry(attempt);
            }
        }

        log.error("WhatsApp order notification could not be delivered for order {} after {} attempts",
                order.getOrderNumber(), MAX_ATTEMPTS);
    }

    private Map<String, Object> buildTemplateRequest(OrderEntity order) {
        List<Map<String, Object>> parameters = new ArrayList<>();
        parameters.add(textParameter(order.getOrderNumber()));
        parameters.add(textParameter(order.getCustomerName()));
        parameters.add(textParameter(buildItemSummary(order)));
        parameters.add(textParameter(formatMoney(order.getSubtotal())));
        parameters.add(textParameter(formatMoney(order.getDiscountAmount())));
        parameters.add(textParameter(formatMoney(order.getShippingFee())));
        parameters.add(textParameter(formatMoney(order.getTotalAmount())));
        parameters.add(textParameter(buildAddress(order)));

        Map<String, Object> bodyComponent = new LinkedHashMap<>();
        bodyComponent.put("type", "body");
        bodyComponent.put("parameters", parameters);

        Map<String, Object> template = new LinkedHashMap<>();
        template.put("name", properties.getOrderTemplateName());
        template.put("language", Map.of("code", properties.getOrderTemplateLanguage()));
        template.put("components", List.of(bodyComponent));

        Map<String, Object> request = new LinkedHashMap<>();
        request.put("messaging_product", "whatsapp");
        request.put("recipient_type", "individual");
        request.put("to", normalizePhoneNumber(properties.getRecipientPhoneNumber()));
        request.put("type", "template");
        request.put("template", template);
        return request;
    }

    private Map<String, Object> textParameter(String value) {
        return Map.of("type", "text", "text", value == null || value.isBlank() ? "-" : value);
    }

    private String buildItemSummary(OrderEntity order) {
        StringBuilder summary = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            String line = String.format(
                    "%d x %s - %s",
                    item.getQuantity(),
                    item.getProductName(),
                    formatMoney(item.getPrice()));

            if (!summary.isEmpty()) {
                summary.append("\n");
            }
            summary.append(line);

            if (summary.length() >= MAX_ITEM_SUMMARY_LENGTH) {
                summary.setLength(MAX_ITEM_SUMMARY_LENGTH);
                summary.append("...");
                break;
            }
        }
        return summary.isEmpty() ? "-" : summary.toString();
    }

    private String buildAddress(OrderEntity order) {
        List<String> parts = new ArrayList<>();
        addIfPresent(parts, order.getShippingStreet());
        addIfPresent(parts, order.getShippingCity());
        addIfPresent(parts, order.getShippingState());
        addIfPresent(parts, order.getShippingPostalCode());
        addIfPresent(parts, order.getShippingCountry());
        return parts.isEmpty() ? "-" : String.join(", ", parts);
    }

    private void addIfPresent(List<String> parts, String value) {
        if (value != null && !value.isBlank()) {
            parts.add(value.trim());
        }
    }

    private String formatMoney(BigDecimal amount) {
        if (amount == null) {
            return "LKR 0.00";
        }
        return "LKR " + amount.setScale(2).toPlainString();
    }

    private String normalizePhoneNumber(String phone) {
        return phone == null ? "" : phone.replaceAll("[^0-9]", "");
    }

    private void sleepBeforeRetry(int attempt) {
        try {
            Thread.sleep(Duration.ofSeconds(attempt).toMillis());
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }
}
