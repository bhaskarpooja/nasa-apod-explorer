package com.nasa.apod.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApodResponse {
    
    @JsonProperty("date")
    private String date;
    
    @JsonProperty("explanation")
    private String explanation;
    
    @JsonProperty("hdurl")
    private String hdurl;
    
    @JsonProperty("media_type")
    private String mediaType;
    
    @JsonProperty("service_version")
    private String serviceVersion;
    
    @JsonProperty("title")
    private String title;
    
    @JsonProperty("url")
    private String url;
    
    @JsonProperty("copyright")
    private String copyright;
    
    @JsonProperty("thumbnail_url")
    private String thumbnailUrl;
}

