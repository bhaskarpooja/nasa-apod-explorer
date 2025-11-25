package com.nasa.apod.client;

import com.nasa.apod.config.NasaApiConfig;
import com.nasa.apod.model.ApodResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
public class NasaApiClient {

    private static final Logger logger = LoggerFactory.getLogger(NasaApiClient.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final LocalDate APOD_START_DATE = LocalDate.of(1995, 6, 16);

    private final RestTemplate restTemplate;
    private final NasaApiConfig nasaApiConfig;

    @Autowired
    public NasaApiClient(RestTemplate restTemplate, NasaApiConfig nasaApiConfig) {
        this.restTemplate = restTemplate;
        this.nasaApiConfig = nasaApiConfig;
    }

    public ApodResponse getApodByDate(String date) {
        validateDate(date);
        
        Map<String, String> params = new HashMap<>();
        params.put("date", date);
        params.put("api_key", nasaApiConfig.getNasaApiKey());

        try {
            logger.info("Fetching APOD from NASA API for date: {}", date);
            ApodResponse response = restTemplate.getForObject(
                nasaApiConfig.getNasaApiBaseUrl() + "?date={date}&api_key={api_key}",
                ApodResponse.class,
                params
            );
            
            if (response == null) {
                throw new RuntimeException("No data returned from NASA API");
            }
            
            logger.info("Successfully fetched APOD: {}", response.getTitle());
            return response;
        } catch (RestClientException e) {
            logger.error("Error fetching APOD from NASA API: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch APOD from NASA API: " + e.getMessage(), e);
        }
    }

    public ApodResponse getTodayApod() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        return getApodByDate(today);
    }

    private void validateDate(String date) {
        try {
            LocalDate parsedDate = LocalDate.parse(date, DATE_FORMATTER);
            LocalDate today = LocalDate.now();
            
            if (parsedDate.isAfter(today)) {
                throw new IllegalArgumentException("Date cannot be in the future");
            }
            
            if (parsedDate.isBefore(APOD_START_DATE)) {
                throw new IllegalArgumentException("APOD data is only available from " + APOD_START_DATE);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD", e);
        }
    }
}

