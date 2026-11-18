package com.ferto.service;

import com.ferto.dto.RecommendationRequest;
import com.ferto.model.Recommendation;
import com.ferto.model.User;
import com.ferto.model.Role;
import com.ferto.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private WeatherService weatherService;

    @Value("${ferto.ml.service.url}")
    private String mlServiceUrl;

    public Recommendation createRecommendation(RecommendationRequest request, User user) {
        // 1. Fetch real-time (or simulated) weather metrics
        WeatherService.WeatherData weather = weatherService.getWeatherData(request.getLatitude(), request.getLongitude(), request.getLocation());

        // 2. Prepare database entity
        Recommendation recommendation = new Recommendation();
        recommendation.setUser(user);
        recommendation.setNitrogen(request.getNitrogen());
        recommendation.setPhosphorus(request.getPhosphorus());
        recommendation.setPotassium(request.getPotassium());
        recommendation.setPh(request.getPh());
        recommendation.setMoisture(request.getMoisture());
        recommendation.setOrganicCarbon(request.getOrganicCarbon());
        recommendation.setSoilType(request.getSoilType());
        recommendation.setCropName(request.getCropName());
        recommendation.setLocation(request.getLocation());
        recommendation.setTemperature(weather.getTemperature());
        recommendation.setHumidity(weather.getHumidity());
        recommendation.setRainfall(weather.getRainfall());

        // 3. Request inference from Machine Learning FastAPI service
        try {
            RestTemplate restTemplate = new RestTemplate();
            String endpoint = mlServiceUrl + "/predict";

            Map<String, Object> payload = new HashMap<>();
            payload.put("N", request.getNitrogen());
            payload.put("P", request.getPhosphorus());
            payload.put("K", request.getPotassium());
            payload.put("pH", request.getPh());
            payload.put("moisture", request.getMoisture());
            payload.put("organic_carbon", request.getOrganicCarbon());
            payload.put("soil_type", request.getSoilType());
            payload.put("crop_type", request.getCropName());
            payload.put("location", request.getLocation());
            payload.put("temperature", weather.getTemperature());
            payload.put("humidity", weather.getHumidity());
            payload.put("rainfall", weather.getRainfall());
            payload.put("language", request.getLanguage());
            payload.put("farming_type", request.getFarmingType() != null ? request.getFarmingType() : "Inorganic");

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(endpoint, payload, Map.class);

            if (response != null && response.containsKey("fertilizer")) {
                recommendation.setPredictedFertilizer((String) response.get("fertilizer"));
                recommendation.setRecommendedQuantity((String) response.get("quantity"));
                recommendation.setConfidence(((Number) response.get("confidence")).doubleValue());
                
                if (response.containsKey("expected_yield")) {
                    recommendation.setExpectedYield(((Number) response.get("expected_yield")).doubleValue());
                } else {
                    recommendation.setExpectedYield(0.0);
                }
                
                String rawExplanation = (String) response.get("explanation");
                String tips = (String) response.get("tips");
                recommendation.setExplanation(rawExplanation + "\n\nField Application Tips: " + tips);
            } else {
                throw new RuntimeException("Empty response from ML service");
            }

        } catch (Exception e) {
            // ================================================================
            // FALLBACK LOGIC: Fall back to local agronomic rule-based engine
            // ================================================================
            System.err.println("Warning: ML Prediction Service is offline. Using local rule-based engine. Error: " + e.getMessage());
            
            Double n = request.getNitrogen();
            Double p = request.getPhosphorus();
            Double k = request.getPotassium();
            Double ph = request.getPh();
            Double carbon = request.getOrganicCarbon();
            String crop = request.getCropName().toLowerCase();

            String fertilizer;
            String quantity;
            String explanation;

            if (carbon < 0.45) {
                fertilizer = "Organic Compost";
                quantity = "800 kg/acre";
                explanation = "Your soil organic carbon index is critically depleted (< 0.45%). Farmyard manure/compost is highly recommended to improve microbial health and water holding capacity before applying chemical fertilizers.";
            } else if (ph > 8.0) {
                fertilizer = "Gypsum";
                quantity = "150 kg/acre";
                explanation = "Highly alkaline/sodic soil (pH > 8.0) is detected. Gypsum is recommended as it supplies calcium and sulfur to displace excessive sodium, helping neutralize alkaline pockets and improve soil porosity.";
            } else if (ph < 5.8 && p < 45) {
                fertilizer = "SSP";
                quantity = "120 kg/acre";
                explanation = "Highly acidic soil conditions paired with phosphorus deficiency detected. Single Super Phosphate (SSP) is recommended as it supplies phosphorus alongside calcium and sulfur, buffering acidic indices.";
            } else if (ph > 7.6 && n < 50) {
                fertilizer = "Ammonium Sulfate";
                quantity = "80 kg/acre";
                explanation = "Alkaline soil and low nitrogen levels are observed. Ammonium Sulfate is recommended here because the ammonium ions will release acidity upon nitrification, helping neutralize alkaline pockets.";
            } else if (n < 40 && p >= 50 && k >= 50) {
                fertilizer = "Urea";
                quantity = "50 kg/acre";
                explanation = "Nitrogen is severely depleted while other primary macronutrients are sufficient. Concentrated Urea is recommended to stimulate rapid growth and leafy photosynthesis.";
            } else if (p < 40 && n < 70) {
                fertilizer = "DAP";
                quantity = "75 kg/acre";
                explanation = "Phosphorus is highly deficient. Diammonium Phosphate (DAP) supplies phosphorus and starter nitrogen, ensuring robust root systems during initial stages.";
            } else if (k < 50 && (crop.contains("tea") || crop.contains("potato") || crop.contains("onion") || crop.contains("garlic"))) {
                fertilizer = "SOP";
                quantity = "50 kg/acre";
                explanation = "Low potassium detected for a chloride-sensitive crop. Sulfate of Potash (SOP) provides chlorine-free potassium along with essential sulfur, preventing chloride toxicity.";
            } else if (k < 40) {
                fertilizer = "MOP";
                quantity = "60 kg/acre";
                explanation = "Soil Potassium is deficient. Muriate of Potash (MOP) is recommended to regulate plant water absorption, cellular transport, and enhance crop resistance against diseases.";
            } else if (n >= 65 && p >= 50 && k >= 50 && ph >= 5.8 && ph <= 7.6 && (crop.contains("maize") || crop.contains("tomato") || crop.contains("garlic") || crop.contains("onion"))) {
                fertilizer = "Zinc Sulfate";
                quantity = "10 kg/acre";
                explanation = "Macronutrient profile is stable, but a micronutrient trace deficiency is indicated. Zinc Sulfate provides a necessary boost for crop enzymes, hormones, and leaf greening.";
            } else if (n < 60 && p < 60 && k < 60) {
                fertilizer = "NPK 19-19-19";
                quantity = "100 kg/acre";
                explanation = "All major macronutrients (N-P-K) are low. A balanced NPK fertilizer will replenish the soil nutrients in equal, healthy proportions.";
            } else if (n < 75) {
                fertilizer = "Urea";
                quantity = "40 kg/acre";
                explanation = "Moderate Nitrogen deficiency detected. A minor Urea application is advised to ensure optimal vegetative performance.";
            } else {
                if (crop.contains("rice") || crop.contains("sugarcane") || crop.contains("cotton") || crop.contains("barley") || crop.contains("mustard") || crop.contains("soybeans")) {
                    fertilizer = "NPK 19-19-19";
                    quantity = "80 kg/acre";
                    explanation = "Soil indices are relatively stable. A standard maintenance dose of NPK 19-19-19 is recommended for heavy-feeding commercial crops.";
                } else {
                    fertilizer = "Organic Compost";
                    quantity = "400 kg/acre";
                    explanation = "Soil test levels are well-balanced. An organic compost top-up is recommended to maintain soil structure and support sustainable microflora.";
                }
            }

            // Override prediction based on farming type
            String fType = request.getFarmingType() != null ? request.getFarmingType().toLowerCase() : "inorganic";
            if (fType.equals("organic")) {
                if (fertilizer.equals("Urea") || fertilizer.equals("Ammonium Sulfate")) {
                    fertilizer = "Neem Cake"; quantity = "200 kg/acre";
                } else if (fertilizer.equals("DAP") || fertilizer.equals("SSP")) {
                    fertilizer = "Bone Meal"; quantity = "100 kg/acre";
                } else if (fertilizer.equals("MOP") || fertilizer.equals("SOP")) {
                    fertilizer = "Wood Ash"; quantity = "50 kg/acre";
                } else if (fertilizer.equals("NPK 19-19-19")) {
                    fertilizer = "Vermicompost"; quantity = "400 kg/acre";
                } else if (fertilizer.equals("Zinc Sulfate")) {
                    fertilizer = "Organic Compost"; quantity = "400 kg/acre";
                }
            } else if (fType.equals("natural")) {
                if (fertilizer.equals("Urea") || fertilizer.equals("Ammonium Sulfate") || fertilizer.equals("DAP") || fertilizer.equals("SSP") || fertilizer.equals("NPK 19-19-19")) {
                    fertilizer = "Jivamrut"; quantity = "200 Liters/acre";
                } else if (fertilizer.equals("MOP") || fertilizer.equals("SOP")) {
                    fertilizer = "Cow Dung Manure"; quantity = "800 kg/acre";
                } else if (fertilizer.equals("Zinc Sulfate")) {
                    fertilizer = "Green Manure"; quantity = "Plant & Incorporate";
                }
            }

            String showcaseWarning = "";
            String requestLang = request.getLanguage();
            if (requestLang != null) {
                requestLang = requestLang.trim().toLowerCase();
                if (!requestLang.equals("en") && !requestLang.equals("hi") && !requestLang.equals("gu")) {
                    showcaseWarning = "[Showcase Mode] ";
                }
            }

            recommendation.setPredictedFertilizer(fertilizer);
            recommendation.setRecommendedQuantity(quantity);
            recommendation.setConfidence(0.85); // Constant fallback confidence indicator
            recommendation.setExplanation(showcaseWarning + explanation + "\n\n(Note: Generated via Java Agronomical Rule-Engine as ML prediction service was unavailable)");

            // Fallback Expected Yield calculation
            double fallbackYield = 2.0;
            if (crop.contains("rice")) {
                fallbackYield = 2.2;
            } else if (crop.contains("wheat")) {
                fallbackYield = 1.8;
            } else if (crop.contains("maize")) {
                fallbackYield = 2.5;
            } else if (crop.contains("cotton")) {
                fallbackYield = 1.2;
            } else if (crop.contains("sugarcane")) {
                fallbackYield = 35.0;
            } else if (crop.contains("tea")) {
                fallbackYield = 0.9;
            } else if (crop.contains("potato")) {
                fallbackYield = 12.0;
            } else if (crop.contains("tomato")) {
                fallbackYield = 15.0;
            } else if (crop.contains("groundnut")) {
                fallbackYield = 1.4;
            } else if (crop.contains("barley")) {
                fallbackYield = 1.6;
            } else if (crop.contains("mustard")) {
                fallbackYield = 0.8;
            } else if (crop.contains("soybean")) {
                fallbackYield = 1.1;
            } else if (crop.contains("onion")) {
                fallbackYield = 10.0;
            } else if (crop.contains("garlic")) {
                fallbackYield = 4.5;
            }
            
            if (carbon != null) {
                if (carbon < 0.45) {
                    fallbackYield *= 0.7;
                } else if (carbon > 0.9) {
                    fallbackYield *= 1.15;
                }
            }
            
            if (ph != null) {
                if (crop.contains("tea")) {
                    if (ph >= 5.8) fallbackYield *= 0.65;
                } else {
                    if (ph > 8.0 || ph < 5.5) fallbackYield *= 0.8;
                }
            }
            
            fallbackYield = Math.round(fallbackYield * 100.0) / 100.0;
            recommendation.setExpectedYield(fallbackYield);
        }

        // 4. Save to Database
        return recommendationRepository.save(recommendation);
    }

    public List<Recommendation> getRecommendationsForUser(Long userId) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void deleteRecommendation(Long id, User user) {
        Recommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found with id: " + id));
        if (!rec.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new SecurityException("Unauthorized delete attempt.");
        }
        recommendationRepository.delete(rec);
    }

    public long countRecommendationsForUser(Long userId) {
        return recommendationRepository.countByUserId(userId);
    }

    public Map<String, Object> parseSoilReport(MultipartFile file) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String endpoint = mlServiceUrl + "/parse-report";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            // Wrap the file bytes with original filename support
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(endpoint, requestEntity, Map.class);
            return response;
        } catch (Exception e) {
            System.err.println("Warning: ML Report Parser offline. Using Java fallback parser. Error: " + e.getMessage());
            
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", true);
            fallbackResponse.put("filename", file.getOriginalFilename());
            
            Map<String, Object> data = new HashMap<>();
            data.put("nitrogen", 65.0);
            data.put("phosphorus", 55.0);
            data.put("potassium", 65.0);
            data.put("ph", 6.8);
            data.put("moisture", 40.0);
            data.put("organicCarbon", 0.70);
            data.put("soilType", "Loamy");
            data.put("location", "Gujarat");
            
            fallbackResponse.put("data", data);
            fallbackResponse.put("warnings", java.util.Collections.singletonList("Warning: ML parsing service was offline. Default values loaded."));
            fallbackResponse.put("isMocked", true);
            
            return fallbackResponse;
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> suggestCrops(Map<String, Object> request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String endpoint = mlServiceUrl + "/suggest-crops";
            
            List<Map<String, Object>> response = restTemplate.postForObject(endpoint, request, List.class);
            return response;
        } catch (Exception e) {
            System.err.println("Warning: ML Crop Advisor offline. Using Java fallback rules. Error: " + e.getMessage());
            
            String soil = ((String) request.getOrDefault("soilType", "Loamy")).trim().toLowerCase();
            String loc = ((String) request.getOrDefault("location", "Punjab")).trim().toLowerCase();
            double ph = ((Number) request.getOrDefault("ph", 6.5)).doubleValue();
            double moisture = ((Number) request.getOrDefault("moisture", 45.0)).doubleValue();
            
            String[] crops = {"Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Tea", "Potato", "Tomato", "Groundnut", "Barley", "Mustard", "Soybeans", "Onion", "Garlic"};
            List<Map<String, Object>> suggestions = new java.util.ArrayList<>();
            
            for (String crop : crops) {
                int score = 55;
                String reason = "Compatible with regional soil parameters.";
                
                if (soil.equals("loamy")) {
                    score += 25;
                    reason = "Loamy soil provides a balanced, fertile medium suitable for most crops.";
                } else if (soil.equals("sandy")) {
                    if (crop.equals("Groundnut") || crop.equals("Barley") || crop.equals("Mustard") || crop.equals("Onion") || crop.equals("Garlic")) {
                        score += 35;
                        reason = "Sandy soil offers high drainage which is ideal for " + crop + ".";
                    } else if (crop.equals("Rice") || crop.equals("Sugarcane")) {
                        score -= 30;
                    }
                } else if (soil.equals("clayey")) {
                    if (crop.equals("Rice") || crop.equals("Sugarcane") || crop.equals("Cotton")) {
                        score += 30;
                        reason = "Clayey soil retains water needed for " + crop + ".";
                    }
                }
                
                if (loc.contains("assam") && (crop.equals("Tea") || crop.equals("Rice"))) {
                    score += 20;
                    reason = "Humid, rainy climates are perfect for tea/rice cultivation.";
                } else if (loc.contains("rajasthan") && (crop.equals("Barley") || crop.equals("Mustard") || crop.equals("Onion"))) {
                    score += 20;
                    reason = "Semi-arid climates suit low water demand of " + crop + ".";
                }
                
                int finalScore = Math.max(15, Math.min(98, score));
                Map<String, Object> item = new HashMap<>();
                item.put("crop", crop);
                item.put("suitability", finalScore);
                item.put("reason", reason);
                suggestions.add(item);
            }
            
            // Sort list by score descending
            suggestions.sort((a, b) -> ((Integer) b.get("suitability")).compareTo((Integer) a.get("suitability")));
            
            return suggestions.subList(0, Math.min(suggestions.size(), 4));
        }
    }
}
