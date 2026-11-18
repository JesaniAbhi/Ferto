package com.ferto.controller;

import com.ferto.model.Recommendation;
import com.ferto.model.User;
import com.ferto.repository.UserRepository;
import com.ferto.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.ferto.service.WeatherService weatherService;

    @GetMapping("/weather")
    public ResponseEntity<?> getWeather(@RequestParam(defaultValue = "Punjab") String location, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }
        try {
            com.ferto.service.WeatherService.WeatherData weatherData = weatherService.getWeatherData(location);
            Map<String, Object> response = new HashMap<>();
            response.put("location", location);
            
            Map<String, Object> current = new HashMap<>();
            current.put("temperature", weatherData.getTemperature());
            current.put("humidity", weatherData.getHumidity());
            current.put("rainfall", weatherData.getRainfall());
            current.put("windSpeed", Math.round((10.0 + (new java.util.Random().nextDouble() * 10)) * 10.0) / 10.0);
            current.put("uvIndex", weatherData.getTemperature() > 30 ? "High" : "Moderate");
            
            String desc = "Sunny";
            String icon = "☀️";
            if (weatherData.getHumidity() > 80) { desc = "Heavy Rain"; icon = "🌧️"; }
            else if (weatherData.getHumidity() > 65) { desc = "Overcast"; icon = "☁️"; }
            else if (weatherData.getHumidity() > 50) { desc = "Partly Cloudy"; icon = "⛅"; }
            current.put("description", desc);
            current.put("icon", icon);
            response.put("current", current);
            
            java.util.List<Map<String, Object>> forecast = new java.util.ArrayList<>();
            String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
            int currentDayIdx = java.time.LocalDate.now().getDayOfWeek().getValue() - 1; // 0-6
            
            for (int i = 0; i < 5; i++) {
                String dayName = days[(currentDayIdx + i) % 7];
                Map<String, Object> fDay = new HashMap<>();
                fDay.put("day", dayName);
                
                double tempMax = weatherData.getTemperature() + (new java.util.Random().nextDouble() * 4 - 1);
                double tempMin = weatherData.getTemperature() - 8 - (new java.util.Random().nextDouble() * 3);
                double hum = Math.max(10, Math.min(100, weatherData.getHumidity() + (new java.util.Random().nextDouble() * 10 - 5)));
                
                String fDesc = "Sunny";
                String fIcon = "☀️";
                if (hum > 80) { fDesc = "Showers"; fIcon = "🌧️"; }
                else if (hum > 65) { fDesc = "Humid/Overcast"; fIcon = "☁️"; }
                else if (hum > 50) { fDesc = "Partly Cloudy"; fIcon = "⛅"; }
                
                fDay.put("tempMax", Math.round(tempMax) + "°");
                fDay.put("tempMin", Math.round(tempMin) + "°");
                fDay.put("humidity", Math.round(hum * 10.0) / 10.0);
                fDay.put("rainfall", Math.round((weatherData.getRainfall() / 3.0 + new java.util.Random().nextDouble() * 3) * 10.0) / 10.0);
                fDay.put("desc", fDesc);
                fDay.put("icon", fIcon);
                
                forecast.add(fDay);
            }
            response.put("forecast", forecast);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving weather data: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }

        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getName()));

            List<Recommendation> history = recommendationService.getRecommendationsForUser(user.getId());

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalRecommendations", history.size());

            if (history.isEmpty()) {
                stats.put("avgNitrogen", 0.0);
                stats.put("avgPhosphorus", 0.0);
                stats.put("avgPotassium", 0.0);
                stats.put("avgPh", 0.0);
                stats.put("avgMoisture", 0.0);
                stats.put("avgOrganicCarbon", 0.0);
                stats.put("latestFertilizer", "N/A");
                stats.put("latestDate", "N/A");
                stats.put("distribution", new HashMap<>());
                return ResponseEntity.ok(stats);
            }

            double sumN = 0, sumP = 0, sumK = 0, sumPh = 0, sumMoisture = 0, sumCarbon = 0;
            Map<String, Integer> distribution = new HashMap<>();

            for (Recommendation r : history) {
                sumN += r.getNitrogen();
                sumP += r.getPhosphorus();
                sumK += r.getPotassium();
                sumPh += r.getPh();
                sumMoisture += r.getMoisture();
                sumCarbon += r.getOrganicCarbon();

                String fert = r.getPredictedFertilizer();
                distribution.put(fert, distribution.getOrDefault(fert, 0) + 1);
            }

            int size = history.size();
            stats.put("avgNitrogen", Math.round((sumN / size) * 10.0) / 10.0);
            stats.put("avgPhosphorus", Math.round((sumP / size) * 10.0) / 10.0);
            stats.put("avgPotassium", Math.round((sumK / size) * 10.0) / 10.0);
            stats.put("avgPh", Math.round((sumPh / size) * 10.0) / 10.0);
            stats.put("avgMoisture", Math.round((sumMoisture / size) * 10.0) / 10.0);
            stats.put("avgOrganicCarbon", Math.round((sumCarbon / size) * 100.0) / 100.0);

            Recommendation latest = history.get(0);
            stats.put("latestFertilizer", latest.getPredictedFertilizer());
            stats.put("latestDate", latest.getCreatedAt().toString());
            stats.put("distribution", distribution);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving dashboard statistics: " + e.getMessage());
        }
    }
}
