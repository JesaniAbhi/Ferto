from fastapi import FastAPI, HTTPException, Header, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import os
import random
from datetime import datetime

app = FastAPI(title="Ferto Spring Boot Mock Gateway", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = os.path.join(os.path.dirname(__file__), "mock_db.json")

def load_db():
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

TICKETS_FILE = os.path.join(os.path.dirname(__file__), "mock_tickets.json")

def load_tickets():
    if not os.path.exists(TICKETS_FILE):
        return []
    try:
        with open(TICKETS_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_tickets(data):
    with open(TICKETS_FILE, "w") as f:
        json.dump(data, f, indent=4)

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class PredictRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    moisture: float
    organicCarbon: float
    soilType: str
    cropName: str
    location: str
    language: str = "en"
    farmingType: str = "Inorganic"

@app.post("/api/auth/login")
def login(req: LoginRequest):
    role = "ROLE_ADMIN" if req.username.lower() == "admin" else "ROLE_USER"
    return {
        "token": "mock-jwt-token-string-for-" + req.username,
        "type": "Bearer",
        "username": req.username,
        "email": req.username + "@agriengine.com",
        "role": role
    }

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    return {
        "success": True,
        "message": "User registered successfully!",
        "username": req.username
    }

@app.post("/api/recommendations/predict")
async def predict(req: PredictRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    # Simulate weather based on location
    base_temp, base_hum, base_rain = 28.0, 60.0, 100.0
    loc = req.location.lower()
    if "punjab" in loc:
        base_temp, base_hum, base_rain = 28.0, 45.0, 65.0
    elif "andhra" in loc:
        base_temp, base_hum, base_rain = 32.5, 70.0, 115.0
    elif "maharashtra" in loc:
        base_temp, base_hum, base_rain = 29.5, 58.0, 90.0
    elif "assam" in loc:
        base_temp, base_hum, base_rain = 24.0, 85.0, 210.0
    elif "karnataka" in loc:
        base_temp, base_hum, base_rain = 26.5, 65.0, 105.0
    elif "gujarat" in loc:
        base_temp, base_hum, base_rain = 30.5, 50.0, 75.0
    elif "rajasthan" in loc:
        base_temp, base_hum, base_rain = 33.0, 35.0, 40.0
    elif "tamil nadu" in loc:
        base_temp, base_hum, base_rain = 31.0, 72.0, 120.0
    elif "uttar pradesh" in loc:
        base_temp, base_hum, base_rain = 27.5, 55.0, 85.0
    elif "west bengal" in loc:
        base_temp, base_hum, base_rain = 28.5, 78.0, 160.0

    temp = round(base_temp + random.uniform(-2, 2), 1)
    humidity = round(max(10, min(100, base_hum + random.uniform(-5, 5))), 1)
    rainfall = round(max(0, base_rain + random.uniform(-15, 15)), 1)

    fertilizer = "Organic Compost"
    quantity = "400 kg/acre"
    confidence = 0.85
    explanation = "Optimized soil parameters."
    expected_yield = 2.0

    # Attempt to contact ML FastAPI service running on port 8000
    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "N": req.nitrogen,
                "P": req.phosphorus,
                "K": req.potassium,
                "pH": req.ph,
                "moisture": req.moisture,
                "organic_carbon": req.organicCarbon,
                "soil_type": req.soilType,
                "crop_type": req.cropName,
                "location": req.location,
                "temperature": temp,
                "humidity": humidity,
                "rainfall": rainfall,
                "language": req.language,
                "farming_type": req.farmingType
            }
            res = await client.post("http://127.0.0.1:8000/predict", json=payload, timeout=3.0)
            if res.status_code == 200:
                data = res.json()
                fertilizer = data["fertilizer"]
                quantity = data["quantity"]
                confidence = data["confidence"]
                explanation = data["explanation"] + "\n\nField Application Tips: " + data["tips"]
                expected_yield = data.get("expected_yield", 2.0)
    except Exception as e:
        # Fallback to local rule evaluation matching Java
        n, p, k, ph, carbon = req.nitrogen, req.phosphorus, req.potassium, req.ph, req.organicCarbon
        crop = req.cropName.lower()
        
        lang = req.language.strip().lower() if req.language else "en"
        showcase_prefix = ""
        if lang not in ["en", "hi", "gu"]:
            showcase_prefix = "[Showcase Mode] "
        
        if carbon < 0.45:
            fertilizer, quantity = "Organic Compost", "800 kg/acre"
            explanation = "Your soil organic carbon index is critically depleted (< 0.45%). Farmyard manure/compost is highly recommended."
        elif ph > 8.0:
            fertilizer, quantity = "Gypsum", "150 kg/acre"
            explanation = "Highly alkaline/sodic soil (pH > 8.0) is detected. Gypsum supplies calcium and sulfur to displace sodium, improving soil permeability."
        elif ph < 5.8 and p < 45:
            fertilizer, quantity = "SSP", "120 kg/acre"
            explanation = "Highly acidic soil conditions paired with phosphorus deficiency detected. Single Super Phosphate (SSP) is recommended."
        elif ph > 7.6 and n < 50:
            fertilizer, quantity = "Ammonium Sulfate", "80 kg/acre"
            explanation = "Alkaline soil and low nitrogen levels are observed. Ammonium Sulfate is recommended to help acidify soil."
        elif n < 40 and p >= 50 and k >= 50:
            fertilizer, quantity = "Urea", "50 kg/acre"
            explanation = "Nitrogen is severely depleted. Concentrated Urea is recommended."
        elif p < 40 and n < 70:
            fertilizer, quantity = "DAP", "75 kg/acre"
            explanation = "Phosphorus is highly deficient. Diammonium Phosphate (DAP) supplies starter phosphorus."
        elif k < 50 and any(c in crop for c in ['tea', 'potato', 'onion', 'garlic']):
            fertilizer, quantity = "SOP", "50 kg/acre"
            explanation = "Low potassium detected for a chloride-sensitive crop. Sulfate of Potash (SOP) provides chlorine-free potassium."
        elif k < 40:
            fertilizer, quantity = "MOP", "60 kg/acre"
            explanation = "Soil Potassium is deficient. Muriate of Potash (MOP) is recommended."
        elif n >= 65 and p >= 50 and k >= 50 and 5.8 <= ph <= 7.6 and any(c in crop for c in ['maize', 'tomato', 'garlic', 'onion']):
            fertilizer, quantity = "Zinc Sulfate", "10 kg/acre"
            explanation = "Micronutrient deficiency. Zinc Sulfate provides a necessary boost for crop enzyme and growth systems."
        elif n < 60 and p < 60 and k < 60:
            fertilizer, quantity = "NPK 19-19-19", "100 kg/acre"
            explanation = "All major macronutrients (N-P-K) are low. A balanced NPK fertilizer will replenish the soil."
        elif n < 75:
            fertilizer, quantity = "Urea", "40 kg/acre"
            explanation = "Moderate Nitrogen deficiency detected. A minor Urea application is advised."
        else:
            if "rice" in crop or "sugarcane" in crop or "cotton" in crop or "barley" in crop or "mustard" in crop or "soybeans" in crop:
                fertilizer, quantity = "NPK 19-19-19", "80 kg/acre"
                explanation = "A maintenance dose of NPK 19-19-19 is recommended."
            else:
                fertilizer, quantity = "Organic Compost", "400 kg/acre"
                explanation = "Soil test levels are well-balanced. An organic compost top-up is recommended."
                
        # Override prediction based on farming type (fallback logic)
        f_type = req.farmingType.lower()
        if f_type == "organic":
            if fertilizer in ['Urea', 'Ammonium Sulfate']:
                fertilizer, quantity = "Neem Cake", "200 kg/acre"
            elif fertilizer in ['DAP', 'SSP']:
                fertilizer, quantity = "Bone Meal", "100 kg/acre"
            elif fertilizer in ['MOP', 'SOP']:
                fertilizer, quantity = "Wood Ash", "50 kg/acre"
            elif fertilizer == 'NPK 19-19-19':
                fertilizer, quantity = "Vermicompost", "400 kg/acre"
            elif fertilizer == 'Zinc Sulfate':
                fertilizer, quantity = "Organic Compost", "400 kg/acre"
        elif f_type == "natural":
            if fertilizer in ['Urea', 'Ammonium Sulfate', 'DAP', 'SSP', 'NPK 19-19-19']:
                fertilizer, quantity = "Jivamrut", "200 Liters/acre"
            elif fertilizer in ['MOP', 'SOP']:
                fertilizer, quantity = "Cow Dung Manure", "800 kg/acre"
            elif fertilizer == 'Zinc Sulfate':
                fertilizer, quantity = "Green Manure", "Plant & Incorporate"
                
        explanation = showcase_prefix + explanation + "\n\n(Note: Generated via Mock Backend Agronomical Rules because ML API was offline)"

        # Fallback Expected Yield calculation
        crop_lower = crop.lower()
        fallback_yield = 2.0
        if "rice" in crop_lower:
            fallback_yield = 2.2
        elif "wheat" in crop_lower:
            fallback_yield = 1.8
        elif "maize" in crop_lower:
            fallback_yield = 2.5
        elif "cotton" in crop_lower:
            fallback_yield = 1.2
        elif "sugarcane" in crop_lower:
            fallback_yield = 35.0
        elif "tea" in crop_lower:
            fallback_yield = 0.9
        elif "potato" in crop_lower:
            fallback_yield = 12.0
        elif "tomato" in crop_lower:
            fallback_yield = 15.0
        elif "groundnut" in crop_lower:
            fallback_yield = 1.4
        elif "barley" in crop_lower:
            fallback_yield = 1.6
        elif "mustard" in crop_lower:
            fallback_yield = 0.8
        elif "soybean" in crop_lower:
            fallback_yield = 1.1
        elif "onion" in crop_lower:
            fallback_yield = 10.0
        elif "garlic" in crop_lower:
            fallback_yield = 4.5
        
        if carbon is not None:
            if carbon < 0.45:
                fallback_yield *= 0.7
            elif carbon > 0.9:
                fallback_yield *= 1.15
        
        if ph is not None:
            if "tea" in crop_lower:
                if ph >= 5.8:
                    fallback_yield *= 0.65
            else:
                if ph > 8.0 or ph < 5.5:
                    fallback_yield *= 0.8
        
        expected_yield = round(fallback_yield, 2)

    # Save to history file db
    record = {
        "id": len(load_db()) + 1,
        "nitrogen": req.nitrogen,
        "phosphorus": req.phosphorus,
        "potassium": req.potassium,
        "ph": req.ph,
        "moisture": req.moisture,
        "organicCarbon": req.organicCarbon,
        "soilType": req.soilType,
        "cropName": req.cropName,
        "location": req.location,
        "temperature": temp,
        "humidity": humidity,
        "rainfall": rainfall,
        "predictedFertilizer": fertilizer,
        "recommendedQuantity": quantity,
        "confidence": confidence,
        "expectedYield": expected_yield,
        "explanation": explanation,
        "createdAt": datetime.now().isoformat()
    }
    
    db = load_db()
    db.append(record)
    save_db(db)
    
    return record

@app.get("/api/recommendations/history")
def history(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    db = load_db()
    return sorted(db, key=lambda x: x["createdAt"], reverse=True)

@app.delete("/api/recommendations/history/{id}")
def delete_history(id: int, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    db = load_db()
    
    found = False
    new_db = []
    for r in db:
        if r["id"] == id:
            found = True
        else:
            new_db.append(r)
            
    if not found:
        raise HTTPException(status_code=404, detail="Record not found")
        
    save_db(new_db)
    return {"message": "Recommendation deleted successfully."}

@app.get("/api/weather")
def get_weather(location: str = "Punjab", authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    loc = location.lower()
    base_temp, base_hum, base_rain = 28.0, 60.0, 100.0
    
    if "punjab" in loc:
        base_temp, base_hum, base_rain = 28.0, 45.0, 65.0
    elif "andhra" in loc:
        base_temp, base_hum, base_rain = 32.5, 70.0, 115.0
    elif "maharashtra" in loc:
        base_temp, base_hum, base_rain = 29.5, 58.0, 90.0
    elif "assam" in loc:
        base_temp, base_hum, base_rain = 24.0, 85.0, 210.0
    elif "karnataka" in loc:
        base_temp, base_hum, base_rain = 26.5, 65.0, 105.0
    elif "gujarat" in loc:
        base_temp, base_hum, base_rain = 30.5, 50.0, 75.0
    elif "rajasthan" in loc:
        base_temp, base_hum, base_rain = 33.0, 35.0, 40.0
    elif "tamil nadu" in loc:
        base_temp, base_hum, base_rain = 31.0, 72.0, 120.0
    elif "uttar pradesh" in loc:
        base_temp, base_hum, base_rain = 27.5, 55.0, 85.0
    elif "west bengal" in loc:
        base_temp, base_hum, base_rain = 28.5, 78.0, 160.0

    temp = round(base_temp + random.uniform(-2, 2), 1)
    humidity = round(max(10, min(100, base_hum + random.uniform(-5, 5))), 1)
    rainfall = round(max(0, (base_rain / 30.0) + random.uniform(-2, 2)), 1)
    wind_speed = round(random.uniform(5, 20), 1)
    
    if base_temp > 32:
        uv_index = "Very High"
    elif base_temp > 28:
        uv_index = "High"
    else:
        uv_index = "Moderate"
        
    if humidity > 80:
        desc = "Heavy Rain"
        icon = "🌧️"
    elif humidity > 70:
        desc = "Light Showers"
        icon = "🌦️"
    elif humidity > 55:
        desc = "Overcast"
        icon = "☁️"
    elif humidity > 45:
        desc = "Scattered Clouds"
        icon = "⛅"
    else:
        desc = "Clear Sunny Sky"
        icon = "☀️"

    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    current_idx = datetime.now().weekday()
    
    forecast = []
    for i in range(5):
        day_name = days[(current_idx + i) % 7]
        day_temp_max = round(base_temp + random.uniform(-1, 3) - i * 0.5, 1)
        day_temp_min = round(base_temp - random.uniform(8, 12) - i * 0.3, 1)
        day_hum = round(max(10, min(100, base_hum + random.uniform(-8, 8) + i * 2)), 1)
        day_rain = round(max(0, (base_rain / 30.0) + random.uniform(-3, 4) + i * 0.5), 1)
        
        if day_hum > 80:
            d_desc, d_icon = "Showers", "🌧️"
        elif day_hum > 68:
            d_desc, d_icon = "Humid/Overcast", "☁️"
        elif day_hum > 50:
            d_desc, d_icon = "Partly Cloudy", "⛅"
        else:
            d_desc, d_icon = "Sunny", "☀️"
            
        forecast.append({
            "day": day_name,
            "icon": d_icon,
            "tempMax": f"{int(day_temp_max)}°",
            "tempMin": f"{int(day_temp_min)}°",
            "desc": d_desc,
            "humidity": day_hum,
            "rainfall": day_rain
        })

    return {
        "location": location,
        "current": {
            "temperature": temp,
            "humidity": humidity,
            "rainfall": rainfall,
            "windSpeed": wind_speed,
            "uvIndex": uv_index,
            "description": desc,
            "icon": icon
        },
        "forecast": forecast
    }

@app.get("/api/dashboard/stats")
def stats(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    db = load_db()
    
    response = {
        "totalRecommendations": len(db),
        "avgNitrogen": 0.0,
        "avgPhosphorus": 0.0,
        "avgPotassium": 0.0,
        "avgPh": 0.0,
        "avgMoisture": 0.0,
        "avgOrganicCarbon": 0.0,
        "latestFertilizer": "N/A",
        "latestDate": "N/A",
        "distribution": {}
    }
    
    if not db:
        return response
        
    sum_n = sum_p = sum_k = sum_ph = sum_moist = sum_carb = 0.0
    dist = {}
    
    for r in db:
        sum_n += r["nitrogen"]
        sum_p += r["phosphorus"]
        sum_k += r["potassium"]
        sum_ph += r["ph"]
        sum_moist += r["moisture"]
        sum_carb += r["organicCarbon"]
        
        fert = r["predictedFertilizer"]
        dist[fert] = dist.get(fert, 0) + 1
        
    n = len(db)
    response["avgNitrogen"] = round(sum_n / n, 1)
    response["avgPhosphorus"] = round(sum_p / n, 1)
    response["avgPotassium"] = round(sum_k / n, 1)
    response["avgPh"] = round(sum_ph / n, 1)
    response["avgMoisture"] = round(sum_moist / n, 1)
    response["avgOrganicCarbon"] = round(sum_carb / n, 2)
    
    latest = sorted(db, key=lambda x: x["createdAt"], reverse=True)[0]
    response["latestFertilizer"] = latest["predictedFertilizer"]
    response["latestDate"] = latest["createdAt"]
    response["distribution"] = dist
    
    return response

@app.post("/api/recommendations/parse-report")
async def parse_report(file: UploadFile = File(...), authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    try:
        async with httpx.AsyncClient() as client:
            file_content = await file.read()
            files = {'file': (file.filename, file_content, file.content_type)}
            res = await client.post("http://127.0.0.1:8000/parse-report", files=files, timeout=10.0)
            if res.status_code == 200:
                return res.json()
            else:
                raise HTTPException(status_code=res.status_code, detail=res.text)
    except Exception as e:
        import re
        filename = file.filename
        parsed = {}
        for key, pattern in [('nitrogen', r'N\b\D*(\d+(?:\.\d+)?)'), ('phosphorus', r'P\b\D*(\d+(?:\.\d+)?)'), ('potassium', r'K\b\D*(\d+(?:\.\d+)?)')]:
            m = re.search(pattern, filename, re.IGNORECASE)
            if m:
                parsed[key] = float(m.group(1))
                
        defaults = {
            "nitrogen": 65.0,
            "phosphorus": 55.0,
            "potassium": 65.0,
            "ph": 6.8,
            "moisture": 40.0,
            "organicCarbon": 0.70,
            "soilType": "Loamy",
            "location": "Gujarat"
        }
        for k, v in defaults.items():
            if k not in parsed:
                parsed[k] = v
                
        return {
            "success": True,
            "filename": filename,
            "data": parsed,
            "warnings": ["Warning: ML parser service is offline. Parameters parsed using fallback filename extractor."],
            "isMocked": True
        }

class SuggestCropsRequest(BaseModel):
    soilType: str
    location: str
    ph: float
    moisture: float
    nitrogen: float = 60.0
    phosphorus: float = 50.0
    potassium: float = 60.0
    organicCarbon: float = 0.65

@app.post("/api/recommendations/suggest-crops")
async def suggest_crops(req: SuggestCropsRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "soilType": req.soilType,
                "location": req.location,
                "ph": req.ph,
                "moisture": req.moisture,
                "nitrogen": req.nitrogen,
                "phosphorus": req.phosphorus,
                "potassium": req.potassium,
                "organicCarbon": req.organicCarbon
            }
            res = await client.post("http://127.0.0.1:8000/suggest-crops", json=payload, timeout=5.0)
            if res.status_code == 200:
                return res.json()
            else:
                raise HTTPException(status_code=res.status_code, detail=res.text)
    except Exception as e:
        soil = req.soilType.strip().capitalize()
        loc = req.location.strip().capitalize()
        ph = req.ph
        moisture = req.moisture
        
        crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Tea', 'Potato', 'Tomato', 'Groundnut', 'Barley', 'Mustard', 'Soybeans', 'Onion', 'Garlic']
        suggestions = []
        for crop in crops:
            score = 55
            reasons = []
            if soil == 'Loamy':
                score += 25
                reasons.append("Loamy soil provides a balanced, fertile medium suitable for most crops.")
            elif soil == 'Sandy':
                if crop in ['Groundnut', 'Barley', 'Mustard', 'Onion', 'Garlic']:
                    score += 35
                    reasons.append(f"Sandy soil drains well which suits {crop}.")
                elif crop in ['Rice', 'Sugarcane']:
                    score -= 30
            elif soil == 'Clayey':
                if crop in ['Rice', 'Sugarcane', 'Cotton']:
                    score += 30
                    reasons.append(f"Clayey soil retains water needed for {crop}.")
            if 'Assam' in loc and crop in ['Tea', 'Rice']:
                score += 20
                reasons.append("Humid, rainy climates are perfect for tea/rice.")
            elif 'Rajasthan' in loc and crop in ['Barley', 'Mustard', 'Onion']:
                score += 20
                reasons.append("Semi-arid climates suit low water demand crops.")
            final_score = max(15, min(98, score))
            suggestions.append({
                "crop": crop,
                "suitability": final_score,
                "reason": " ".join(reasons) if reasons else "Compatible with regional parameters."
            })
        suggestions = sorted(suggestions, key=lambda x: x["suitability"], reverse=True)
        return suggestions[:4]

class ChatRequest(BaseModel):
    message: str
    language: str = "en"

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str = None
    message: str = None
    type: str = "EXECUTIVE_CALLBACK"

@app.post("/api/support/chat")
def mock_chat(req: ChatRequest):
    user_message = req.message.strip().lower()
    lang = req.language.strip().lower() if req.language else "en"
    
    replies = {
        "en": {
            "empty": "Please enter a question or query, and I'd be happy to help!",
            "hello": "Hello! I am your GreenSteward AI Assistant (Mock). How can I help you manage your soil and fertilizers today?",
            "nitrogen": "Nitrogen (N) is crucial for leaf growth and green color. If your soil is low in nitrogen, plants will have yellow leaves and stunted growth. We recommend nitrogen-rich fertilizers like Urea or Ammonium Nitrate.",
            "phosphorus": "Phosphorus (P) is essential for root development, flowering, and seed formation. If phosphorus is low, roots will be weak. You can use Superphosphate or Monoammonium Phosphate (MAP).",
            "potassium": "Potassium (K) helps with water resistance, disease prevention, and overall plant health. Low potassium makes plants susceptible to drought and pests. Muriate of Potash (MOP) is a common potassium fertilizer.",
            "ph": "Soil pH determines nutrient availability. Most crops thrive in slightly acidic to neutral soil (pH 6.0 to 7.0). If pH is too low (acidic), add lime (calcium carbonate). If it is too high (alkaline), add sulfur or organic compost.",
            "moisture": "Soil moisture is vital for nutrient uptake. Clay soils hold water longer, whereas sandy soils drain quickly. Keep soil moisture in the optimal range (typically 30%-60% depending on crop) to avoid root rot or drought stress.",
            "carbon": "Organic carbon improves soil structure, water retention, and microbial activity. Increase organic carbon by adding compost, manure, or cover crops.",
            "howto": "To get a recommendation, go to the 'Recommendation Engine' tab in the navbar. Enter your soil nutrients (N, P, K), pH, moisture, organic carbon, soil type, crop name, and location. Our system will analyze the weather and soil parameters to predict the best fertilizer and quantity!",
            "history": "You can view your past fertilizer recommendations and calculations by visiting the 'Calculation History' tab in the navbar. It keeps a record of all your inputs and results.",
            "dashboard": "The Dashboard provides a summary of your activities, including average soil nutrients, distribution of predicted fertilizers, and your latest calculations.",
            "executive": "Sure! I can help connect you with a GreenSteward Executive. Please click the 'Contact Channels' tab, and fill out the 'Talk to Executive' form to request a callback, or call us directly at +1 (800) 555-SOIL.",
            "email": "You can email our support team at support@greensteward.com or fill out the contact form under the 'Contact Channels' tab.",
            "help": "I can assist you with soil nutrient queries (N, P, K, pH, moisture), how to use GreenSteward, or help you contact an executive. What is on your mind?",
            "default": "I understand you have a query. To give you the best help: \n" \
                      "1. For soil queries, ask about Nitrogen, Phosphorus, Potassium, pH, Moisture, or Carbon. \n" \
                      "2. For app queries, ask about how to use the Recommendation Engine, History, or Dashboard. \n" \
                      "3. To speak with an executive, type 'executive' or click the 'Contact Channels' tab to request a callback."
        },
        "hi": {
            "empty": "कृपया कोई प्रश्न या जिज्ञासा दर्ज करें, और मुझे सहायता करने में खुशी होगी!",
            "hello": "नमस्ते! मैं आपका ग्रीनस्टीवर्ड एआई सहायक (मॉक) हूँ। आज मैं आपकी मिट्टी और उर्वरकों के प्रबंधन में आपकी क्या सहायता कर सकता हूँ?",
            "nitrogen": "पत्ती के विकास और हरे रंग के लिए नाइट्रोजन (N) महत्वपूर्ण है। यदि आपकी मिट्टी में नाइट्रोजन की कमी है, तो पौधों की पत्तियां पीली हो जाएंगी और विकास रुक जाएगा। हम यूरिया या अमोनियम नाइट्रेट जैसे नाइट्रोजन युक्त उर्वरकों की सिफारिश करते हैं।",
            "phosphorus": "जड़ विकास, पुष्पन और बीज निर्माण के लिए फास्फोरस (P) आवश्यक है। फास्फोरस कम होने पर जड़ें कमजोर होंगी। आप सिंगल सुपरफॉस्फेट (SSP) या डायमोनियम फॉस्फेट (DAP) का उपयोग कर सकते हैं।",
            "potassium": "पोटेशियम (K) जल प्रतिरोध, रोग नियंत्रण और पौधों के समग्र स्वास्थ्य में मदद करता है। कम पोटेशियम पौधों को सूखे और कीटों के प्रति संवेदनशील बनाता है। मूरिएट ऑफ पोटाश (MOP) एक आम पोटेशियम उर्वरक है।",
            "ph": "मिट्टी का पीएच (pH) पोषक तत्वों की उपलब्धता निर्धारित करता है। अधिकांश फसलें थोड़ा अम्लीय से तटस्थ मिट्टी (pH 6.0 से 7.0) में पनपती हैं। यदि पीएच बहुत कम (अम्लीय) है, तो चूना (कैल्शियम कार्बोनेट) मिलाएं। यदि यह बहुत अधिक (क्षारीय) है, तो सल्फर या जैविक खाद मिलाएं।",
            "moisture": "पोषक तत्वों के अवसूषण के लिए मिट्टी की नमी महत्वपूर्ण है। चिकनी मिट्टी अधिक समय तक पानी रोकती है, जबकि रेतीली मिट्टी जल्दी सूख जाती है। जड़ सड़न या सूखे के तनाव से बचने के लिए मिट्टी की नमी को इष्टतम सीमा (फसल के आधार पर 30%-60%) में रखें।",
            "carbon": "जैविक कार्बन मिट्टी की संरचना, जल धारण क्षमता और सूक्ष्मजीव गतिविधि में सुधार करता है। कम्पोस्ट, गोबर की खाद या हरी खाद मिलाकर जैविक कार्बन बढ़ाएं।",
            "howto": "सिफारिश प्राप्त करने के लिए, नेविगेशन बार में 'अनुशंसा इंजन' टैब पर जाएं। अपनी मिट्टी के पोषक तत्व (N, P, K), पीएच, नमी, जैविक कार्बन, मिट्टी का प्रकार, फसल का नाम और स्थान दर्ज करें। हमारा सिस्टम मौसम और मिट्टी के मापदंडों का विश्लेषण करके सर्वोत्तम उर्वरक और मात्रा की भविष्यवाणी करेगा!",
            "history": "आप नेविगेशन बार में 'गणना इतिहास' टैब पर जाकर अपनी पिछली उर्वरक सिफारिशों और गणनाओं को देख सकते हैं। यह आपके सभी इनपुट और परिणामों का रिकॉर्ड रखता है।",
            "dashboard": "डैशबोर्ड आपकी गतिविधियों का सारांश प्रदान करता है, जिसमें औसत मिट्टी के पोषक तत्व, अनुमानित उर्वरकों का वितरण और आपकी नवीनतम गणना शामिल हैं।",
            "executive": "ज़रूर! मैं ग्रीनस्टीवर्ड कार्यकारी से जुड़ने में आपकी मदद कर सकता हूँ। कृपया 'संपर्क माध्यम' टैब पर क्लिक करें, और कॉल-बैक का अनुरोध करने के लिए 'एक कार्यकारी से बात करें' फॉर्म भरें, या हमें सीधे +1 (800) 555-SOIL पर कॉल करें।",
            "email": "आप हमारी सहायता टीम को support@greensteward.com पर ईमेल कर सकते हैं या 'संपर्क माध्यम' टैब के तहत संपर्क फ़ॉर्म भर सकते हैं।",
            "help": "मैं मिट्टी के पोषक तत्वों के प्रश्नों (N, P, K, pH, नमी), ग्रीनस्टीवर्ड का उपयोग कैसे करें, या कार्यकारी से संपर्क करने में आपकी सहायता कर सकता हूँ। आपके दिमाग में क्या है?",
            "default": "मुझे समझ में आया कि आपका कोई प्रश्न है। सर्वोत्तम सहायता प्राप्त करने के लिए: \n" \
                      "1. मिट्टी के प्रश्नों के लिए, नाइट्रोजन, फास्फोरस, पोटेशियम, पीएच, नमी या कार्बन के बारे में पूछें। \n" \
                      "2. ऐप के प्रश्नों के लिए, अनुशंसा इंजन, इतिहास या डैशबोर्ड का उपयोग करने के बारे में पूछें। \n" \
                      "3. किसी कार्यकारी से बात करने के लिए, 'executive' टाइप करें या कॉल-बैक का अनुरोध करने के लिए 'संपर्क माध्यम' टैब पर क्लिक करें।"
        },
        "gu": {
            "empty": "કૃપા કરીને કોઈ પ્રશ્ન અથવા જિજ્ઞાસા દાખલ કરો, અને મને મદદ કરવામાં આનંદ થશે!",
            "hello": "નમસ્તે! હું તમારો ગ્રીનસ્ટુઅર્ડ એઆઈ સહાયક (મૉક) છું. આજે હું તમારી જમીન અને ખાતરોના સંચાલનમાં તમને કેવી રીતે મદદ કરી શકું?",
            "nitrogen": "પાંદડાના વિકાસ અને લીલા રંગ માટે નાઇટ્રોજન (N) મહત્વપૂર્ણ છે. જો તમારી જમીનમાં નાઇટ્રોજન ઓછું હોય, તો પાંદડા પીળા પડી જશે અને વિકાસ અટકી જશે. અમે યુરિયા અથવા એમોનિયમ સલ્ફેટ જેવા નાઇટ્રોજનયુક્ત ખાતરોની ભલામણ કરીએ છીએ.",
            "phosphorus": "મૂળના વિકાસ, ફૂલો અને બીજ નિર્માણ માટે ફોસ્ફરસ (P) જરૂરી છે. જો ફોસ્ફરસ ઓછું હશે, તો મૂળ નબળા પડશે. તમે સિંગલ સુપરફોસ્ફેટ (SSP) અથવા ડાયમોનિયમ ફોસ્ફેટ (DAP) નો ઉપયોગ કરી શકો છો.",
            "potassium": "પોટેશિયમ (K) પાણીના વહન, રોગ નિયંત્રણ અને છોડના એકંદર સ્વાસ્થ્યમાં મદદ કરે છે. ઓછું પોટેશિયમ છોડને દુષ્કાળ અને જંતુઓ માટે સંવેદનશીલ બનાવે છે. મ્યુરિએટ ઓફ પોટાશ (MOP) એ સામાન્ય પોટેશિયમ ખાતર છે.",
            "ph": "જમીનનું pH પોષક તત્વોની પ્રાપ્યતા નક્કી કરે છે. મોટાભાગના પાકો સહેજ એસિડિકથી તટસ્થ જમીનમાં (pH 6.0 થી 7.0) સારા થાય છે. જો pH ખૂબ ઓછું (એસિડિક) હોય, તો ચૂનો ઉમેરો. જો તે ખૂબ વધારે (આલ્કલાઇન) હોય, તો સલ્ફર અથવા ઓર્ગેનિક કમ્પોસ્ટ ઉમેરો.",
            "moisture": "પોષક તત્વોના શોષણ માટે જમીનનો ભેજ મહત્વપૂર્ણ છે. ચીકણી જમીન વધુ સમય સુધી પાણી રાખે છે, જ્યારે રેતાળ જમીન ઝડપથી સુકાઈ જાય છે. મૂળ સડવા અથવા દુષ્કાળથી બચવા માટે જમીનના ભેજને શ્રેષ્ઠ શ્રેણીમાં (સામાન્ય રીતે 30%-60%) રાખો.",
            "carbon": "ઓર્ગેનિક કાર્બન જમીનનું બંધારણ, પાણી સંગ્રહ અને સૂક્ષ્મજીવોની પ્રવૃત્તિમાં સુધારો કરે છે. કમ્પોસ્ટ અથવા ખાતર ઉમેરીને ઓર્ગેનિક કાર્બન વધારો.",
            "howto": "ભલામણ મેળવવા માટે, નેવિગેશન બારમાં 'ભલામણ એન્જિન' ટેબ પર જાઓ. તમારી જમીનના પોષક તત્વો (N, P, K), પીએચ, ભેજ, ઓર્ગેનિક કાર્બન, જમીનનો પ્રકાર, પાકનું નામ અને સ્થાન દાખલ કરો. અમારું સિસ્ટમ હવામાન અને જમીનના પરિમાણોનું વિશ્લેષણ કરીને શ્રેષ્ઠ ખાતર અને જથ્થાની આગાહી કરશે!",
            "history": "તમે નેવિગેશન બારમાં 'ગણતરીનો ઇતિહાસ' ટેબની મુલાકાત લઈને તમારી અગાઉની ખાતર ભલામણો અને ગણતરીઓ જોઈ શકો છો. તે તમારા બધા ઇનપુટ્સ અને પરિણામોનો રેકોર્ડ રાખે છે.",
            "dashboard": "ડેશબોર્ડ તમારી પ્રવૃત્તિઓનો સારાંશ આપે છે, જેમાં સરેરાશ જમીનના પોષક તત્વો, અંદાજિત ખાતરોનું વિતરણ અને તમારી નવીનતમ ગણતરીઓ શામેલ છે.",
            "executive": "ચોક્કસ! હું ગ્રીનસ્ટુઅર્ડ અધિકારી સાથે જોડાવામાં તમારી મદદ કરી શકું છું. કૃપા કરીને 'સંપર્ક માધ્યમો' ટેબ પર ક્લિક કરો અને કોલ-બેકની વિનંતી કરવા માટે ફોર્મ ભરો, અથવા અમને સીધા +1 (800) 555-SOIL પર કૉલ કરો.",
            "email": "તમે support@greensteward.com પર અમારી સપોર્ટ ટીમને ઈમેલ કરી શકો છો અથવા 'સંપર્ક માધ્યમો' ટેબ હેઠળ ફોર્મ ભરી શકો છો.",
            "help": "હું તમને જમીનના પોષક તત્વોના પ્રશ્નો (N, P, K, pH, ભેજ), ગ્રીનસ્ટુઅર્ડનો ઉપયોગ કેવી રીતે કરવો અથવા અધિકારીનો સંપર્ક કરવામાં મદદ કરી શકું છું. તમારા મનમાં શું છે?",
            "default": "હું સમજું છું કે તમારી પાસે પ્રશ્ન છે. શ્રેષ્ઠ મદદ મેળવવા માટે: \n1. જમીનના પ્રશ્નો માટે, નાઇટ્રોજન, ફોસ્ફરસ, પોટેશિયમ, પીએચ, ભેજ અથવા કાર્બન વિશે પૂછો. \n2. એપ્લિકેશન પ્રશ્નો માટે, ભલામણ એન્જિન, ઇતિહાસ અથવા ડેશબોર્ડનો ઉપયોગ કેવી રીતે કરવો તે પૂછો. \n3. અધિકારી સાથે વાત કરવા માટે, 'executive' લખો અથવા 'સંપર્ક માધ્યમો' ટેબ પર ક્લિક કરો।"
        },
        "pa": {
            "empty": "ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਪ੍ਰਸ਼ਨ ਜਾਂ ਪੁੱਛਗਿੱਛ ਦਰਜ ਕਰੋ, ਅਤੇ ਮੈਨੂੰ ਮਦਦ ਕਰਨ ਵਿੱਚ ਖੁਸ਼ੀ ਹੋਵੇਗੀ!",
            "hello": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਗ੍ਰੀਨਸਟੀਵਰਡ AI ਸਹਾਇਕ (Mock) ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਮਿੱਟੀ ਅਤੇ ਖਾਦਾਂ ਦੇ ਪ੍ਰਬੰਧਨ ਵਿੱਚ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
            "nitrogen": "ਨਾਈਟ੍ਰੋਜਨ (N) ਪੱਤਿਆਂ ਦੇ ਵਾਧੇ ਅਤੇ ਹਰੇ ਰੰਗ ਲਈ ਬਹੁਤ ਮਹੱતਵਪੂਰਨ ਹੈ। ਜੇਕਰ ਤੁਹਾਡੀ ਮਿੱਟੀ ਵਿੱਚ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ ਹੈ, ਤਾਂ ਪੌਦਿਆਂ ਦੇ ਪੱਤੇ ਪੀਲੇ ਹੋ ਜਾਣਗੇ ਅਤੇ ਵਾਧਾ ਰੁਕ ਜਾਵੇਗਾ। ਅਸੀਂ ਯੂਰੀਆ ਜਾਂ ਅਮੋਨੀਅਮ ਨਾਈਟ੍ਰੇਟ ਵਰਗੇ ਨਾਈਟ੍ਰੋਜਨ ਵਾਲੇ ਖਾਦਾਂ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦੇ ਹਾਂ।",
            "phosphorus": "ਜੜ੍ਹਾਂ ਦੇ ਵਿਕਾਸ, ਫੁੱਲ ਪੈਣ ਅਤੇ ਬੀਜ ਬਣਨ ਲਈ ਫਾਸਫੋਰਸ (P) ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਜੇਕਰ ਫਾਸਫੋਰਸ ਘੱਟ ਹੈ, ਤਾਂ ਜੜ੍ਹਾਂ ਕਮਜ਼ੋਰ ਹੋਣਗੀਆਂ। ਤੁਸੀਂ ਸਿੰਗਲ ਸੁਪਰਫਾਸਫੇਟ (SSP) ਜਾਂ ਡਾਇਮੋਨੀਅਮ ਫਾਸਫੇਟ (DAP) ਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹੋ।",
            "potassium": "ਪੋਟਾਸ਼ੀਅਮ (K) ਪਾਣੀ ਦੇ ਪ੍ਰਬੰਧਨ, ਬਿਮਾਰੀਆਂ ਨਾਲ ਲੜਨ ਅਤੇ ਪੌਦਿਆਂ ਦੀ ਸਮੁੱਚੀ ਸਿਹਤ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਘੱਟ ਪੋਟਾਸ਼ੀਅਮ ਪੌਦਿਆਂ ਨੂੰ ਸੋਕੇ ਅਤੇ ਕੀੜਿਆਂ ਦੇ ਪ੍ਰਤੀ ਸੰਵੇਦਨਸ਼ੀਲ ਬਣਾਉਂਦਾ ਹੈ। ਮਿਊਰੀਏટ ਆਫ ਪੋਟਾਸ਼ (MOP) ਇੱਕ ਆਮ ਪੋਟਾਸ਼ੀਅਮ ਖਾਦ ਹੈ।",
            "ph": "ਮਿੱਟੀ ਦਾ pH ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਉਪਲਬਧਤਾ ਨੂੰ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ। ਜ਼ਿਆਦਾਤਰ ਫਸਲਾਂ ਥੋੜ੍ਹੀ ਤੇਜ਼ਾਬੀ ਤੋਂ ਸਧਾਰਨ ਮਿੱਟੀ (pH 6.0 ਤੋਂ 7.0) ਵਿੱਚ ਵਧਦੀਆਂ ਹਨ। ਜੇਕਰ pH ਬਹੁਤ ਘੱਟ (ਤੇਜ਼ਾਬੀ) ਹੈ, ਤਾਂ ਚੂਨਾ (ਕੈਲਸ਼ੀਅਮ ਕਾਰਬੋਨੇਟ) ਮਿਲਾਓ। ਜੇਕਰ ਇਹ ਬਹੁਤ ਜ਼ਿਆਦਾ (ਖਾਰੀ) ਹੈ, ਤਾਂ ਗੰਧਕ ਜਾਂ ਜੈਵਿਕ ਖਾਦ ਮਿਲਾਓ।",
            "moisture": "ਪੋਸ਼ਕ ਤੱਤਾਂ ਨੂੰ ਸੋਖਣ ਲਈ ਮਿੱਟੀ ਦੀ ਨਮੀ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਚਿਕਣੀ ਮਿੱਟੀ ਜ਼ਿਆਦਾ ਦੇਰ ਤੱਕ ਪਾਣੀ ਰੋਕਦੀ ਹੈ, ਜਦੋਂ ਕਿ ਰੇਤਲੀ ਮਿੱਟੀ ਜਲਦੀ ਸੁੱਕ ਜਾਂਦੀ ਹੈ। ਜੜ੍ਹਾਂ ਦੇ ਗਲਣ ਜਾਂ ਸੋਕੇ ਤੋਂ ਬਚਣ ਲਈ ਮਿੱટી ਦੀ ਨਮੀ ਨੂੰ ਢੁਕਵੀਂ ਸੀਮਾ (ਫਸਲ ਦੇ ਅਧਾਰ ਤੇ 30%-60%) ਵਿੱਚ ਰੱਖੋ।",
            "carbon": "ਜੈਵਿਕ ਕਾਰਬਨ ਮਿੱટી ਦੀ ਬਣਤਰ, ਪਾਣੀ ਰੋਕਣ ਦੀ ਸਮਰੱਥਾ ਅਤੇ ਸੂਖਮ ਜੀਵਾਂ ਦੀ ਗਤੀਵਿਧੀ ਵਿੱਚ ਸੁਧਾਰ ਕਰਦਾ ਹੈ। ਕੰਪੋਸટ ਜਾਂ ਗੋਬਰ ਦੀ ਖਾਦ ਮਿਲਾ ਕੇ ਜੈਵਿਕ ਕਾਰਬਨ ਵਧਾਓ।",
            "howto": "ਸਿਫਾਰਸ਼ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ, ਨੇਵੀਗੇਸ਼ਨ ਬਾਰ ਵਿੱਚ 'ਸਿਫਾਰਸ਼ ਇੰਜਣ' ਟੈਬ 'ਤੇ ਜਾਓ। ਆਪਣੀ ਮਿੱਟੀ ਦੇ ਪੋਸ਼ਕ ਤੱਤ (N, P, K), pH, ਨਮੀ, ਜੈਵਿਕ ਕਾਰਬਨ, ਮਿੱਟੀ ਦੀ ਕਿਸਮ, ਫਸਲ ਦਾ ਨਾਮ ਅਤੇ ਸਥਾਨ ਦਰਜ ਕਰੋ। ਸਾਡਾ ਸਿਸਟਮ ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਦੇ ਮਾਪਦੰਡਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਕੇ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ ਅਤੇ ਮਾਤરા ਦੀ ਭਵਿੱਖਬਾਣੀ ਕਰੇਗਾ!",
            "history": "ਤੁਸੀਂ ਨੇਵੀਗੇਸ਼ਨ ਬਾਰ ਵਿੱਚ 'ਗਣਨਾ ਇਤਿਹਾਸ' ਟੈਬ 'ਤੇ ਜਾ ਕੇ ਆਪਣੀਆਂ ਪਿਛਲੀਆਂ ਖਾਦ ਸਿਫਾਰਸ਼ਾਂ ਅਤੇ ਗਣਨਾਵਾਂ ਨੂੰ ਦੇਖ ਸਕਦੇ ਹੋ। ਇਹ ਤੁਹਾਡੇ ਸਾਰੇ ਇਨਪੁਟ ਅਤੇ ਨਤੀਜਿਆਂ ਦਾ ਰਿਕਾਰਡ ਰੱਖਦਾ ਹੈ।",
            "dashboard": "ਡੈਸ਼ਬੋਰਡ ਤੁਹਾਡੀਆਂ ਗਤੀਵਿਧੀਆਂ ਦਾ ਸਾਰ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ, ਜਿਸ ਵਿੱਚ ਔਸਤ ਮਿੱਟੀ ਦੇ ਪੋਸ਼ਕ ਤੱਤ, ਭਵਿੱਖਬਾਣੀ ਕੀਤੇ ਗਏ ਖਾਦਾਂ ਦੀ ਵੰਡ ਅਤੇ ਤੁਹਾਡੀਆਂ ਤਾਜ਼ਾ ਗਣਨਾਵਾਂ ਸ਼ਾਮਲ ਹਨ।",
            "executive": "ਬਿਲਕੁਲ! ਮੈਂ ਗ੍ਰੀਨਸਟੀਵਰਡ ਕਾਰਜਕਾਰੀ ਨਾਲ ਜੁੜਨ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ 'ਸੰਪਰਕ ਚੈਨਲ' ਟੈਬ 'ਤੇ ਕਲਿੱક ਕਰੋ, ਅਤੇ ਕਾਲ-ਬੈਕ ਦੀ ਬੇਨਤੀ ਕਰਨ ਲਈ 'ਇੱਕ ਕਾਰਜਕਾਰੀ ਨਾਲ ਗੱલ ਕਰੋ' ਫਾਰਮ ਭਰੋ, ਜਾਂ ਸਾਨੂੰ ਸਿੱਧਾ +1 (800) 555-SOIL 'ਤੇ ਕਾਲ ਕਰੋ।",
            "email": "ਤੁਸੀਂ ਸਾਡੀ ਸਹਾਇਤਾ ਟੀਮ ਨੂੰ support@greensteward.com 'ਤੇ ਈਮੇલ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ 'ਸੰਪਰਕ ਚੈਨਲ' ਟੈබ ਦੇ ਅਧੀਨ ਸੰਪਰਕ ਫਾਰਮ ਭਰ ਹੋ ਸਕਦੇ ਹੋ।",
            "help": "ਮੈਂ ਮਿੱਟੀ ਦੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੇ ਸਵਾਲਾਂ (N, P, K, pH, ਨਮੀ), ਗ੍ਰੀਨਸਟੀਵਰਡ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ, ਜਾਂ ਕਾਰਜਕਾਰੀ ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਹਾਡੇ ਮਨ ਵਿੱਚ ਕੀ է?",
            "default": "ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕਿ ਤੁਹਾਡਾ ਕੋਈ ਸਵਾਲ ਹੈ। ਸਭ ਤੋਂ ਵਧੀਆ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ: \n" \
                      "1. ਮਿੱਟੀ ਦੇ ਸਵਾਲਾਂ ਲਈ, ਨਾਈਟ੍ਰੋਜਨ, ਫਾਸਫੋਰਸ, ਪੋਟਾਸ਼ੀਅਮ, pH, ਨਮੀ ਜਾਂ ਕਾਰਬਨ ਬਾਰੇ ਪੁੱਛੋ। \n" \
                      "2. ਐਪ ਦੇ ਸਵਾਲਾਂ ਲਈ, ਸਿਫਾਰਸ਼ ਇੰਜણ, ਇਤਿਹਾਸ ਜਾਂ ਡੈશਬੋਰਡ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਪੁੱਛੋ। \n" \
                      "3. ਕਿਸੇ ਕਾਰਜਕਾਰੀ ਨਾਲ ਗੱਲ ਕਰਨ ਲਈ, 'executive' ਟਾਈਪ ਕਰੋ ਜਾਂ ਕਾਲ-ਬੈਕ ਦੀ ਬੇਨਤੀ ਕਰਨ ਲਈ 'ਸੰਪਰਕ ਚੈਨਲ' ਟੈබ 'ਤੇ ਕਲਿੱક ਕਰੋ।"
        }
    }
    
    # Fallback to English replies if selected language dictionary is missing
    active_replies = replies.get(lang, replies["en"])
    
    if not user_message:
        reply = active_replies["empty"]
    elif "hello" in user_message or "hi" in user_message or "hey" in user_message or "greetings" in user_message:
        reply = active_replies["hello"]
    elif "nitrogen" in user_message or " n " in user_message:
        reply = active_replies["nitrogen"]
    elif "phosphorus" in user_message or " p " in user_message or "phosphate" in user_message:
        reply = active_replies["phosphorus"]
    elif "potassium" in user_message or " k " in user_message or "potash" in user_message:
        reply = active_replies["potassium"]
    elif "ph" in user_message or "acid" in user_message or "alkaline" in user_message:
        reply = active_replies["ph"]
    elif "moisture" in user_message or "water" in user_message or "dry" in user_message or "wet" in user_message:
        reply = active_replies["moisture"]
    elif "carbon" in user_message or "organic matter" in user_message:
        reply = active_replies["carbon"]
    elif "how to" in user_message or "recommendation" in user_message or "engine" in user_message or "calculate" in user_message or "use" in user_message or "get started" in user_message:
        reply = active_replies["howto"]
    elif "history" in user_message or "past" in user_message or "record" in user_message:
        reply = active_replies["history"]
    elif "dashboard" in user_message or "stats" in user_message or "statistics" in user_message:
        reply = active_replies["dashboard"]
    elif "executive" in user_message or "human" in user_message or "person" in user_message or "talk" in user_message or "call" in user_message or "agent" in user_message or "number" in user_message or "phone" in user_message:
        reply = active_replies["executive"]
    elif "email" in user_message or "mail" in user_message or "write" in user_message:
        reply = active_replies["email"]
    elif "help" in user_message or "query" in user_message or "problem" in user_message or "issue" in user_message or "support" in user_message:
        reply = active_replies["help"]
    else:
        reply = active_replies["default"]
                
    return {"reply": reply}

@app.post("/api/support/contact")
def mock_contact(req: ContactRequest):
    if not req.name or not req.email:
        raise HTTPException(status_code=400, detail="Name and Email are required.")
    
    tickets = load_tickets()
    new_ticket = {
        "id": len(tickets) + 1,
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "message": req.message,
        "type": req.type,
        "status": "PENDING",
        "createdAt": datetime.now().isoformat()
    }
    tickets.append(new_ticket)
    save_tickets(tickets)
    
    return {
        "message": "Your contact request has been registered successfully! An executive will reach out to you shortly (Mocked).",
        "id": new_ticket["id"]
    }

@app.get("/api/support/requests")
def mock_get_requests(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    username = "user"
    if authorization.startswith("Bearer "):
        token = authorization[7:]
        if "mock-jwt-token-string-for-" in token:
            username = token.replace("mock-jwt-token-string-for-", "")
            
    user_email = (username + "@agriengine.com").lower()
    alt_email = username.lower()
    
    tickets = load_tickets()
    user_tickets = [
        t for t in tickets 
        if t["email"].lower() == user_email or t["email"].lower() == alt_email
    ]
    
    user_tickets.sort(key=lambda x: x["createdAt"], reverse=True)
    return user_tickets

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
