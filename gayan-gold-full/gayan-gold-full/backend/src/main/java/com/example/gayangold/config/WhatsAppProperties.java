package com.example.gayangold.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.whatsapp")
public class WhatsAppProperties {

    /** Enable only after the Meta Cloud API credentials and template are ready. */
    private boolean enabled = false;

    /** Example: v23.0. Keep this configurable so Meta API upgrades do not require code changes. */
    private String apiVersion;

    /** Meta WhatsApp Business phone number ID, not the display phone number. */
    private String phoneNumberId;

    /** System-user access token. Never expose this to the frontend. */
    private String accessToken;

    /** WhatsApp number that should receive new-order notifications, in international format. */
    private String recipientPhoneNumber;

    /** Approved Meta WhatsApp template name. */
    private String orderTemplateName = "order_placed";

    /** Approved template language, e.g. en_US. */
    private String orderTemplateLanguage = "en_US";

    public boolean isConfigured() {
        return enabled
                && hasText(apiVersion)
                && hasText(phoneNumberId)
                && hasText(accessToken)
                && hasText(recipientPhoneNumber)
                && hasText(orderTemplateName)
                && hasText(orderTemplateLanguage);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
