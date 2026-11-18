package com.ferto.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.Random;

@Service
public class WeatherService {

    @Value("${ferto.weather.api.url}")
    private String apiUrl;

    @Value("${ferto.weather.api.key}")
    private String apiKey;

    private final Random random = new Random();

    public WeatherData getWeatherData(Double lat, Double lon, String fallbackLocation) {
        if (lat != null && lon != null && apiKey != null && !apiKey.isEmpty() && !apiKey.equals("YOUR_OPENWEATHERMAP_API_KEY")) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=metric", apiUrl, lat, lon, apiKey);
                
                @SuppressWarnings("unchecked")
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                
                if (response != null && response.containsKey("main")) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> main = (Map<String, Object>) response.get("main");
                    double temp = ((Number) main.get("temp")).doubleValue();
                    double humidity = ((Number) main.get("humidity")).doubleValue();
                    
                    double rainfall = simulateRainfall(fallbackLocation);
                    
                    return new WeatherData(temp, humidity, rainfall);
                }
            } catch (Exception e) {
                System.err.println("Warning: Coordinate weather fetch failed, falling back to state baseline. Error: " + e.getMessage());
            }
        }
        return getWeatherData(fallbackLocation);
    }

    public WeatherData getWeatherData(String location) {
        // If an API key is provided and is not the default placeholder, attempt to fetch live weather data
        if (apiKey != null && !apiKey.isEmpty() && !apiKey.equals("YOUR_OPENWEATHERMAP_API_KEY")) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String url = String.format("%s?q=%s&appid=%s&units=metric", apiUrl, location, apiKey);
                
                @SuppressWarnings("unchecked")
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                
                if (response != null && response.containsKey("main")) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> main = (Map<String, Object>) response.get("main");
                    double temp = ((Number) main.get("temp")).doubleValue();
                    double humidity = ((Number) main.get("humidity")).doubleValue();
                    
                    // Rainfall is not always present in standard weather response, simulate realistically
                    double rainfall = simulateRainfall(location);
                    
                    return new WeatherData(temp, humidity, rainfall);
                }
            } catch (Exception e) {
                // Fall back to simulation if the API call fails
            }
        }

        // Simulating realistic climatic averages for Indian agricultural regions
        double baseTemp;
        double baseHumidity;
        double baseRainfall;

        switch (location.trim().toLowerCase()) {
            case "punjab":
                baseTemp = 28.0;
                baseHumidity = 45.0;
                baseRainfall = 65.0;
                break;
            case "andhra pradesh":
                baseTemp = 32.5;
                baseHumidity = 70.0;
                baseRainfall = 115.0;
                break;
            case "maharashtra":
                baseTemp = 29.5;
                baseHumidity = 58.0;
                baseRainfall = 90.0;
                break;
            case "assam":
                baseTemp = 24.0;
                baseHumidity = 85.0;
                baseRainfall = 210.0;
                break;
            case "karnataka":
                baseTemp = 26.5;
                baseHumidity = 65.0;
                baseRainfall = 105.0;
                break;
            case "gujarat":
                baseTemp = 30.5;
                baseHumidity = 50.0;
                baseRainfall = 75.0;
                break;
            case "rajasthan":
                baseTemp = 33.0;
                baseHumidity = 35.0;
                baseRainfall = 40.0;
                break;
            case "tamil nadu":
                baseTemp = 31.0;
                baseHumidity = 72.0;
                baseRainfall = 120.0;
                break;
            case "uttar pradesh":
                baseTemp = 27.5;
                baseHumidity = 55.0;
                baseRainfall = 85.0;
                break;
            case "west bengal":
                baseTemp = 28.5;
                baseHumidity = 78.0;
                baseRainfall = 160.0;
                break;
            default:
                baseTemp = 27.0;
                baseHumidity = 60.0;
                baseRainfall = 100.0;
        }

        // Introduce small micro-variations
        double temp = baseTemp + (random.nextDouble() * 4 - 2); // +/- 2°C
        double humidity = baseHumidity + (random.nextDouble() * 10 - 5); // +/- 5%
        double rainfall = baseRainfall + (random.nextDouble() * 30 - 15); // +/- 15mm

        // Clamp values to realistic limits
        humidity = Math.max(10.0, Math.min(100.0, humidity));
        rainfall = Math.max(0.0, rainfall);

        return new WeatherData(
                Math.round(temp * 10.0) / 10.0,
                Math.round(humidity * 10.0) / 10.0,
                Math.round(rainfall * 10.0) / 10.0
        );
    }

    private double simulateRainfall(String location) {
        switch (location.trim().toLowerCase()) {
            case "assam": return 180.0 + random.nextDouble() * 50;
            case "punjab": return 40.0 + random.nextDouble() * 30;
            default: return 80.0 + random.nextDouble() * 40;
        }
    }

    // Static nested class to hold weather variables
    public static class WeatherData {
        private final double temperature;
        private final double humidity;
        private final double rainfall;

        public WeatherData(double temperature, double humidity, double rainfall) {
            this.temperature = temperature;
            this.humidity = humidity;
            this.rainfall = rainfall;
        }

        public double getTemperature() {
            return temperature;
        }

        public double getHumidity() {
            return humidity;
        }

        public double getRainfall() {
            return rainfall;
        }
    }
}
