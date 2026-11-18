# Software Requirements Specification (SRS)
## Smart Fertilizer Recommendation Engine

### 1. Introduction
This document defines the Software Requirements Specification (SRS) for the **Smart Fertilizer Recommendation Engine**, an AI-powered agricultural web application designed to recommend custom fertilizers based on soil composition, crop types, and environmental weather parameters.

#### 1.1 Scope
The system will run as a distributed web application consisting of a React-based client interface, a Spring Boot backend processing service, and a Python Machine Learning prediction service.

---

### 2. Overall Description

#### 2.1 User Classes
* **Farmers / End Users:** Fill out soil profiles, view reports, check weather forecasts, and download fertilizer guidelines.
* **Agricultural Officers:** Monitor regional trends, validate AI suggestions, and view aggregated history.
* **Administrators:** Control reference data for crops, crop season boundaries, and fertilizer types.

#### 2.2 Operating Environment
* **Frontend:** Standard modern web browsers (Chrome, Edge, Safari, Firefox).
* **Backend:** Java 17 Runtime Environment, Spring Boot 3.x framework.
* **ML Model:** Python 3.11 with FastAPI, scikit-learn, and joblib.
* **Database:** H2 Database (development) and PostgreSQL 15+ (production).

---

### 3. Functional Requirements

#### 3.1 User Management
* **Registration & Auth:** Users must be able to sign up with a username, email, and password. Access is regulated via JSON Web Tokens (JWT).
* **Role Management:** Two roles are supported: `ROLE_USER` and `ROLE_ADMIN`.

#### 3.2 Soil and Crop Module
* **Soil Inputs:** The system must accept soil nitrogen (N), phosphorus (P), potassium (K), pH (acidic/alkaline scale), moisture level (percentage), and organic carbon (percentage).
* **Crop Parameters:** The system must capture crop name, current growth stage (germination, vegetative, flowering, yield), and crop season.

#### 3.3 Weather Integration
* **Real-time Metrics:** The system fetches current temperature, relative humidity, and rainfall estimates based on user coordinates or chosen locations.
* **Fallback Mode:** In case of API failure or missing keys, the application uses local seasonal averages to calculate recommendations.

#### 3.4 Recommendation Engine
* **AI Analysis:** The system submits the data to a Python Random Forest model.
* **Inference Outputs:** Predicts the fertilizer name, recommended dosage (kg per acre), and confidence percentage.
* **Reasoning:** Explains why the specific fertilizer is recommended (e.g., "high acidity requires lime addition, and low N requires Urea").

#### 3.5 Dashboard & History
* **Visual Data:** Standard dashboard showing historical recommendation trends using charts, soil health history, and current weather cards.
* **Data Retrieval:** Users can view their historical recommendation list and delete old entries.
* **PDF Export:** Recommendations must be formatted as printable PDF reports for field use.

---

### 4. Non-Functional Requirements

#### 4.1 Performance & Scalability
* **Latency:** AI recommendation response must be generated within 3 seconds of form submission.
* **Concurrence:** Supports up to 1000 concurrent user sessions.

#### 4.2 Security
* **Authentication:** Passwords must be hashed using BCrypt. JWTs must be used to secure REST endpoints.
* **Access Control:** Admin routes must be restricted to users possessing `ROLE_ADMIN`.
