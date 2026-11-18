package com.ferto.controller;

import com.ferto.model.SupportRequest;
import com.ferto.repository.SupportRequestRepository;
import com.ferto.model.User;
import com.ferto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class SupportController {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${ferto.ml.service.url}")
    private String mlServiceUrl;

    @PostMapping("/chat")
    public ResponseEntity<?> handleChat(@RequestBody Map<String, String> request) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String endpoint = mlServiceUrl + "/chat";
            @SuppressWarnings("unchecked")
            Map<String, String> response = restTemplate.postForObject(endpoint, request, Map.class);
            if (response != null && response.containsKey("reply")) {
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            System.err.println("Warning: ML chat service is offline. Using local rule-based engine. Error: " + e.getMessage());
        }

        String userMessage = request.getOrDefault("message", "").trim().toLowerCase();
        String botReply;

        if (userMessage.isEmpty()) {
            botReply = "Please enter a question or query, and I'd be happy to help!";
        } else if (userMessage.contains("hello") || userMessage.contains("hi") || userMessage.contains("hey") || userMessage.contains("greetings")) {
            botReply = "Hello! I am your GreenSteward AI Assistant. How can I help you manage your soil and fertilizers today?";
        } else if (userMessage.contains("nitrogen") || userMessage.contains(" n ")) {
            botReply = "Nitrogen (N) is crucial for leaf growth and green color. If your soil is low in nitrogen, plants will have yellow leaves and stunted growth. We recommend nitrogen-rich fertilizers like Urea or Ammonium Nitrate.";
        } else if (userMessage.contains("phosphorus") || userMessage.contains(" p ") || userMessage.contains("phosphate")) {
            botReply = "Phosphorus (P) is essential for root development, flowering, and seed formation. If phosphorus is low, roots will be weak. You can use Superphosphate or Monoammonium Phosphate (MAP).";
        } else if (userMessage.contains("potassium") || userMessage.contains(" k ") || userMessage.contains("potash")) {
            botReply = "Potassium (K) helps with water resistance, disease prevention, and overall plant health. Low potassium makes plants susceptible to drought and pests. Muriate of Potash (MOP) is a common potassium fertilizer.";
        } else if (userMessage.contains("ph") || userMessage.contains("acid") || userMessage.contains("alkaline")) {
            botReply = "Soil pH determines nutrient availability. Most crops thrive in slightly acidic to neutral soil (pH 6.0 to 7.0). If pH is too low (acidic), add lime (calcium carbonate). If it is too high (alkaline), add sulfur or organic compost.";
        } else if (userMessage.contains("moisture") || userMessage.contains("water") || userMessage.contains("dry") || userMessage.contains("wet")) {
            botReply = "Soil moisture is vital for nutrient uptake. Clay soils hold water longer, whereas sandy soils drain quickly. Keep soil moisture in the optimal range (typically 30%-60% depending on crop) to avoid root rot or drought stress.";
        } else if (userMessage.contains("carbon") || userMessage.contains("organic matter")) {
            botReply = "Organic carbon improves soil structure, water retention, and microbial activity. Increase organic carbon by adding compost, manure, or cover crops.";
        } else if (userMessage.contains("how to") || userMessage.contains("recommendation") || userMessage.contains("engine") || userMessage.contains("calculate") || userMessage.contains("use") || userMessage.contains("get started")) {
            botReply = "To get a recommendation, go to the 'Recommendation Engine' tab in the navbar. Enter your soil nutrients (N, P, K), pH, moisture, organic carbon, soil type, crop name, and location. Our system will analyze the weather and soil parameters to predict the best fertilizer and quantity!";
        } else if (userMessage.contains("history") || userMessage.contains("past") || userMessage.contains("record")) {
            botReply = "You can view your past fertilizer recommendations and calculations by visiting the 'Calculation History' tab in the navbar. It keeps a record of all your inputs and results.";
        } else if (userMessage.contains("dashboard") || userMessage.contains("stats") || userMessage.contains("statistics")) {
            botReply = "The Dashboard provides a summary of your activities, including average soil nutrients, distribution of predicted fertilizers, and your latest calculations.";
        } else if (userMessage.contains("executive") || userMessage.contains("human") || userMessage.contains("person") || userMessage.contains("talk") || userMessage.contains("call") || userMessage.contains("agent") || userMessage.contains("number") || userMessage.contains("phone")) {
            botReply = "Sure! I can help connect you with a GreenSteward Executive. Please click the 'Contact Channels' tab, and fill out the 'Talk to Executive' form to request a callback, or call us directly at +1 (800) 555-SOIL.";
        } else if (userMessage.contains("email") || userMessage.contains("mail") || userMessage.contains("write")) {
            botReply = "You can email our support team at support@greensteward.com or fill out the contact form under the 'Contact Channels' tab.";
        } else if (userMessage.contains("help") || userMessage.contains("query") || userMessage.contains("problem") || userMessage.contains("issue") || userMessage.contains("support")) {
            botReply = "I can assist you with soil nutrient queries (N, P, K, pH, moisture), how to use GreenSteward, or help you contact an executive. What is on your mind?";
        } else {
            botReply = "I understand you have a query. To give you the best help: \n" +
                       "1. For soil queries, ask about Nitrogen, Phosphorus, Potassium, pH, Moisture, or Carbon. \n" +
                       "2. For app queries, ask about how to use the Recommendation Engine, History, or Dashboard. \n" +
                       "3. To speak with an executive, type 'executive' or click the 'Contact Channels' tab to request a callback.";
        }

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("reply", botReply);
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/contact")
    public ResponseEntity<?> handleContact(@RequestBody SupportRequest supportRequest) {
        if (supportRequest.getName() == null || supportRequest.getName().trim().isEmpty() ||
            supportRequest.getEmail() == null || supportRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and Email are required."));
        }

        if (supportRequest.getType() == null) {
            supportRequest.setType("EXECUTIVE_CALLBACK");
        }
        supportRequest.setStatus("PENDING");

        SupportRequest saved = supportRequestRepository.save(supportRequest);
        return ResponseEntity.ok(Map.of(
            "message", "Your contact request has been registered successfully! An executive will reach out to you shortly.",
            "id", saved.getId()
        ));
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getMyRequests(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated."));
        }

        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getName()));

            List<SupportRequest> requests = supportRequestRepository.findByEmailOrderByCreatedAtDesc(user.getEmail());
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving support requests: " + e.getMessage()));
        }
    }
}
