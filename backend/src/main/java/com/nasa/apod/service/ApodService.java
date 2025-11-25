package com.nasa.apod.service;

import com.nasa.apod.client.NasaApiClient;
import com.nasa.apod.model.ApodResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApodService {

    private static final Logger logger = LoggerFactory.getLogger(ApodService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final NasaApiClient nasaApiClient;

    public ApodService(NasaApiClient nasaApiClient) {
        this.nasaApiClient = nasaApiClient;
    }

    @Cacheable(value = "apodCache", key = "#date")
    public ApodResponse getApodByDate(String date) {
        logger.info("Cache miss for date: {}. Fetching from NASA API...", date);
        return nasaApiClient.getApodByDate(date);
    }

    public ApodResponse getTodayApod() {
        String today = LocalDate.now(ZoneOffset.UTC).format(DATE_FORMATTER);
        logger.info("Fetching today's APOD (date: {})", today);
        return getApodByDate(today);
    }

    public List<ApodResponse> getRecentApods(int count) {
        if (count <= 0 || count > 50) {
            throw new IllegalArgumentException("Count must be between 1 and 50");
        }

        List<ApodResponse> recentApods = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < count; i++) {
            try {
                LocalDate date = today.minusDays(i);
                String dateStr = date.format(DATE_FORMATTER);
                ApodResponse apod = getApodByDate(dateStr);
                recentApods.add(apod);
            } catch (Exception e) {
                logger.warn("Failed to fetch APOD for date offset {}: {}", i, e.getMessage());
                // Continue with other dates even if one fails
            }
        }

        return recentApods;
    }
}

