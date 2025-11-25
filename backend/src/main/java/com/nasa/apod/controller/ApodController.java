package com.nasa.apod.controller;

import com.nasa.apod.model.ApodResponse;
import com.nasa.apod.service.ApodService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/apod")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Validated
public class ApodController {

    private static final Logger logger = LoggerFactory.getLogger(ApodController.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final ApodService apodService;

    public ApodController(ApodService apodService) {
        this.apodService = apodService;
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayApod() {
        try {
            logger.info("GET /api/apod/today");
            ApodResponse response = apodService.getTodayApod();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching today's APOD: {}", e.getMessage());

            String message = e.getMessage();
            String nasaMsg = "Failed to fetch today's APOD.";

            if (message != null && message.contains("\"msg\":")) {
                int start = message.indexOf("\"msg\":\"") + 7;
                int end = message.indexOf("\"", start);
                nasaMsg = message.substring(start, end);
            }

            Map<String, String> error = new HashMap<>();
            error.put("error", nasaMsg);

            return ResponseEntity.badRequest().body(error);
        }
    }


    @GetMapping
    public ResponseEntity<?> getApodByDate(
            @RequestParam(required = false) 
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        try {
            if (date == null) {
                date = LocalDate.now(ZoneOffset.UTC);
            }
            
            String dateStr = date.format(DATE_FORMATTER);
            logger.info("GET /api/apod?date={}", dateStr);
            ApodResponse response = apodService.getApodByDate(dateStr);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid date parameter: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Error fetching APOD by date: {}", e.getMessage());

            String message = e.getMessage();
            String nasaMsg = message;

            if (message.contains("\"msg\":")) {
                int start = message.indexOf("\"msg\":\"") + 7;
                int end = message.indexOf("\"", start);
                nasaMsg = message.substring(start, end);
            }

            Map<String, String> error = new HashMap<>();
            error.put("error", nasaMsg);

            return ResponseEntity.badRequest().body(error);
        }

    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentApods(
            @RequestParam(defaultValue = "10") 
            @Min(1) @Max(50) int count) {
        try {
            logger.info("GET /api/apod/recent?count={}", count);
            List<ApodResponse> responses = apodService.getRecentApods(count);
            return ResponseEntity.ok(responses);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid count parameter: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Error fetching recent APODs: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch recent APODs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "NASA APOD Explorer");
        return ResponseEntity.ok(status);
    }
}

