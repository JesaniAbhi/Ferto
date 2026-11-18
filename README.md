# Ferto - Smart Fertilizer Recommendation Engine 🌾

Ferto is an AI-driven agricultural advisory platform designed to help farmers and agronomists make data-informed fertilizer and crop management decisions. It combines soil nutrient analysis (N, P, K, pH, moisture), real-time weather integration, and machine learning models to provide optimal crop recommendations and expected yield estimates.

---

## 🚀 Key Features

- **🌱 Smart Fertilizer & Crop Recommendations:** Machine learning models predict suitable crops, optimal fertilizer types, and expected yields based on soil and environmental parameters.
- **📄 Soil Lab Report Parser:** Easily parse lab reports to automatically populate diagnostic parameters.
- **📊 Interactive Farmer Dashboard:** Visualize soil health metrics, historical recommendations, and trends using Chart.js.
- **🌦️ Weather Forecasting:** Integrated weather advisory to suggest the best application timing.
- **🔒 Secure Authentication:** Role-based access control with JWT authentication (Farmers & Agronomists).
- **🐳 Full Containerization:** Ready-to-deploy multi-container architecture using Docker and Docker Compose.

---

## 🏗️ Architecture Overview

The system is organized into modular services:

```
├── backend/          # Java Spring Boot 3.2 REST API (Spring Security, JWT, JPA, Flyway)
├── frontend/         # React 19 + Vite + Chart.js interactive dashboard & diagnostic forms
├── ml-model/         # FastAPI Python service hosting Scikit-learn models & data preprocessing
├── database/         # PostgreSQL schema and initial seed data
└── docs/             # PRD, SRS, Architecture, and AWS Deployment guides
```

---

## 🛠️ Quick Start with Docker Compose

Ensure [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) are installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JesaniAbhi/Ferto.git
   cd Ferto
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access services:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000) (or configured port)
   - **Backend API & Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - **ML Model API Docs:** [http://localhost:5000/docs](http://localhost:5000/docs)

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) folder:
- [Architecture Guide](./docs/Architecture.md)
- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Software Requirements Specification (SRS)](./docs/SRS.md)
- [User Manual](./docs/User_Manual.md)
- [AWS Deployment Guide](./docs/AWS_Deployment.md)

---

## 👥 Team Members

| Name | Role | GitHub |
| :--- | :--- | :--- |
| Team Member 1 | Project Lead / Full-Stack | [@JesaniAbhi](https://github.com/JesaniAbhi) |
| Team Member 2 | Member | - |
| Team Member 3 | Member | - |
| Team Member 4 | Member | - |

---

## 📄 License

This project is open-source and available under the standard MIT License.
