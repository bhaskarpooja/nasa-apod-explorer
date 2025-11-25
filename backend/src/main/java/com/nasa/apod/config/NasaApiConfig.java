package com.nasa.apod.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class NasaApiConfig {

    @Value("${nasa.api.base-url}")
    private String nasaApiBaseUrl;

    @Value("${nasa.api.key}")
    private String nasaApiKey;

    @Bean
    public RestTemplate restTemplate() {
        ClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        ((SimpleClientHttpRequestFactory) factory).setConnectTimeout(5000);
        ((SimpleClientHttpRequestFactory) factory).setReadTimeout(10000);
        return new RestTemplate(factory);
    }

    public String getNasaApiBaseUrl() {
        return nasaApiBaseUrl;
    }

    public String getNasaApiKey() {
        return nasaApiKey;
    }
}

