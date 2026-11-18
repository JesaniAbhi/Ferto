package com.ferto.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RecommendationRequest {
    @NotNull(message = "Nitrogen level is required")
    @DecimalMin(value = "0.0", message = "Nitrogen level must be non-negative")
    private Double nitrogen;

    @NotNull(message = "Phosphorus level is required")
    @DecimalMin(value = "0.0", message = "Phosphorus level must be non-negative")
    private Double phosphorus;

    @NotNull(message = "Potassium level is required")
    @DecimalMin(value = "0.0", message = "Potassium level must be non-negative")
    private Double potassium;

    @NotNull(message = "pH level is required")
    @DecimalMin(value = "0.0", message = "pH level must be at least 0.0")
    @DecimalMax(value = "14.0", message = "pH level cannot exceed 14.0")
    private Double ph;

    @NotNull(message = "Moisture level is required")
    @DecimalMin(value = "0.0", message = "Moisture level must be at least 0.0%")
    @DecimalMax(value = "100.0", message = "Moisture level cannot exceed 100.0%")
    private Double moisture;

    @NotNull(message = "Organic Carbon level is required")
    @DecimalMin(value = "0.0", message = "Organic Carbon must be at least 0.0%")
    @DecimalMax(value = "10.0", message = "Organic Carbon cannot exceed 10.0%")
    private Double organicCarbon;

    @NotBlank(message = "Soil Type is required")
    private String soilType;

    @NotBlank(message = "Crop Name is required")
    private String cropName;

    @NotBlank(message = "Location is required")
    private String location;


    // Getters and Setters
    public Double getNitrogen() {
        return nitrogen;
    }

    public void setNitrogen(Double nitrogen) {
        this.nitrogen = nitrogen;
    }

    public Double getPhosphorus() {
        return phosphorus;
    }

    public void setPhosphorus(Double phosphorus) {
        this.phosphorus = phosphorus;
    }

    public Double getPotassium() {
        return potassium;
    }

    public void setPotassium(Double potassium) {
        this.potassium = potassium;
    }

    public Double getPh() {
        return ph;
    }

    public void setPh(Double ph) {
        this.ph = ph;
    }

    public Double getMoisture() {
        return moisture;
    }

    public void setMoisture(Double moisture) {
        this.moisture = moisture;
    }

    public Double getOrganicCarbon() {
        return organicCarbon;
    }

    public void setOrganicCarbon(Double organicCarbon) {
        this.organicCarbon = organicCarbon;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    private String language;

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    private String farmingType = "Inorganic";

    public String getFarmingType() {
        return farmingType;
    }

    public void setFarmingType(String farmingType) {
        this.farmingType = farmingType;
    }

    private Double latitude;
    private Double longitude;

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
