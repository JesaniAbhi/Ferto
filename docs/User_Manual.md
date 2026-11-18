# Setup and User Manual

This manual provides detailed instructions on how to set up, configure, and run the **Smart Fertilizer Recommendation Engine** on your local machine.

---

## 1. Prerequisites

Make sure you have the following software installed:
- **Node.js** (v18 or higher) & **npm** (v9 or higher)
- **Python 3.8 - 3.11**
- **Java JDK 17** (or higher) to compile/run Spring Boot
- **Maven** (optional, standard `./mvnw` wrapper is included in the project)

---

## 2. Component Setup Instructions

### Step A: Machine Learning Service (`ml-model/`)
1. Navigate to the `ml-model` directory:
   ```bash
   cd ml-model
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required libraries:
   ```bash
   pip install -r requirements.txt
   ```
4. Generate the dataset and train the Machine Learning model:
   ```bash
   python generate_dataset.py
   python train.py
   ```
   *This trains a Random Forest Classifier and saves `model.joblib`, `scaler.joblib`, and `encoders.joblib`.*
5. Run the FastAPI prediction service:
   ```bash
   uvicorn app:app --port 8000 --reload
   ```
   *The service will start running at `http://127.0.0.1:8000`.*

---

### Step B: Spring Boot Backend (`backend/`)

There are three ways to run the backend, depending on your local environment:

#### Option 1: Run via IDE (Recommended)
If you do not have Java JDK or Maven globally installed on your command line:
1. Open **IntelliJ IDEA** (Community or Ultimate) or **Eclipse**.
2. Select **Open Project** and choose the `backend/` directory.
3. The IDE will automatically configure the Java JDK (version 17+) and resolve Maven dependencies.
4. Locate `FertoApplication.java` in `src/main/java/com/ferto/FertoApplication.java` and click **Run / Debug**.

#### Option 2: Run via CLI (Requires Java & Maven installed)
If you have Java 17+ and Maven configured in your system environment variables:
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

#### Option 3: Run Python-based Mock Backend (Fastest for local testing)
If you want to run the application immediately without configuring Java, you can run the mock backend simulator in Python, which handles state persistence using a local JSON file (`mock_db.json`) and runs on port `8080`:
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the simulator using Python (ensure your virtual environment is active):
   ```bash
   python mock_backend.py
   ```

By default, the backend runs on port `8080`. To configure the database connection, update the parameters in `backend/src/main/resources/application.properties`.

---

### Step C: React Frontend (`frontend/`)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

---

## 3. Testing and Default Credentials

To simplify testing, the database is pre-seeded with sample records:
- **Default Admin Account:**
  - **Username:** `admin`
  - **Password:** `admin123`
  - **Role:** Admin
- **Default User Account:**
  - **Username:** `farmer`
  - **Password:** `farmer123`
  - **Role:** Regular User
