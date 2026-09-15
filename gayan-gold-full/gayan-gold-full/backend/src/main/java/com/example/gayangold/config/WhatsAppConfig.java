package com.example.gayangold.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.client.RestClient;

@Configuration
@EnableAsync
@EnableConfigurationProperties(WhatsAppProperties.class)
public class WhatsAppConfig {

    @Bean
    RestClient whatsappRestClient(RestClient.Builder builder) {
        return builder.build();
    }
}
