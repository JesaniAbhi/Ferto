import csv
import random
import os

crop_translations = {
    'Rice': {'hi': 'चावल (धान)', 'gu': 'ડાંગર (ચોખા)'},
    'Wheat': {'hi': 'गेहूं', 'gu': 'ઘઉં'},
    'Maize': {'hi': 'मक्का', 'gu': 'મકાઈ'},
    'Cotton': {'hi': 'कपास', 'gu': 'કપાસ'},
    'Sugarcane': {'hi': 'गन्ना', 'gu': 'શેરડી'},
    'Tea': {'hi': 'चाय', 'gu': 'ચા'},
    'Potato': {'hi': 'आलू', 'gu': 'બટાટા'},
    'Tomato': {'hi': 'टमाटर', 'gu': 'ટામેટા'},
    'Groundnut': {'hi': 'मूंगफली', 'gu': 'મગફળી'},
    'Barley': {'hi': 'जौ', 'gu': 'જવ'},
    'Mustard': {'hi': 'सरसों', 'gu': 'રાઈ'},
    'Soybeans': {'hi': 'सोयाबीन', 'gu': 'સોયાબીન'},
    'Onion': {'hi': 'प्याज़', 'gu': 'ડુંગળી'},
    'Garlic': {'hi': 'लहसुन', 'gu': 'લસણ'}
}

soil_translations = {
    'Loamy': {'hi': 'दोमट', 'gu': 'દોમટ'},
    'Clayey': {'hi': 'चिकनी', 'gu': 'ચીકણી'},
    'Sandy': {'hi': 'रेतीली', 'gu': 'રેતાળ'},
    'Silty': {'hi': 'सिल्टी', 'gu': 'સિલ્ટી'},
    'Peaty': {'hi': 'पीटयुक्त', 'gu': 'પીટયુક્ત'}
}

location_translations = {
    'Punjab': {'hi': 'पंजाब', 'gu': 'પંજાબ'},
    'Andhra Pradesh': {'hi': 'आंध्र प्रदेश', 'gu': 'આંધ્રપ્રદેશ'},
    'Maharashtra': {'hi': 'महाराष्ट्र', 'gu': 'મહારાષ્ટ્ર'},
    'Assam': {'hi': 'असम', 'gu': 'આસામ'},
    'Karnataka': {'hi': 'कर्नाटक', 'gu': 'કર્ણાટક'},
    'Gujarat': {'hi': 'गुजरात', 'gu': 'ગુજરાત'},
    'Rajasthan': {'hi': 'राजस्थान', 'gu': 'રાજસ્થાન'},
    'Tamil Nadu': {'hi': 'तमिलनाडु', 'gu': 'તમિલનાડુ'},
    'Uttar Pradesh': {'hi': 'उत्तर प्रदेश', 'gu': 'ઉત્તર પ્રદેશ'},
    'West Bengal': {'hi': 'पश्चिम बंगाल', 'gu': 'પશ્ચિમ બંગાળ'},
    'Madhya Pradesh': {'hi': 'मध्य प्रदेश', 'gu': 'મધ્ય પ્રદેશ'},
    'Haryana': {'hi': 'हरियाणा', 'gu': 'હરિયાણા'},
    'Bihar': {'hi': 'बिहार', 'gu': 'બિહાર'},
    'Kerala': {'hi': 'केरल', 'gu': 'કેરળ'}
}

def generate_row():
    locations = [
        'Punjab', 'Andhra Pradesh', 'Maharashtra', 'Assam', 'Karnataka', 
        'Gujarat', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal',
        'Madhya Pradesh', 'Haryana', 'Bihar', 'Kerala'
    ]
    location = random.choice(locations)
    
    # Weather, climate, and soil properties vary systematically by region
    if location == 'Punjab':
        soil_type = random.choices(['Loamy', 'Silty', 'Clayey', 'Sandy'], weights=[60, 30, 8, 2])[0]
        N = random.randint(60, 120)
        P = random.randint(30, 75)
        K = random.randint(70, 130)
        ph = round(random.uniform(6.5, 7.8), 1)
        moisture = random.randint(30, 65)
        organic_carbon = round(random.uniform(0.4, 0.85), 2)
        temp = round(random.uniform(15.0, 38.0), 1)
        humidity = random.randint(35, 75)
        rainfall = random.randint(50, 120)
    elif location == 'Rajasthan':
        soil_type = random.choices(['Sandy', 'Loamy', 'Silty'], weights=[90, 8, 2])[0]
        N = random.randint(10, 45)
        P = random.randint(15, 40)
        K = random.randint(30, 75)
        ph = round(random.uniform(7.4, 8.5), 1)
        moisture = random.randint(10, 30)
        organic_carbon = round(random.uniform(0.15, 0.4), 2)
        temp = round(random.uniform(25.0, 45.0), 1)
        humidity = random.randint(15, 45)
        rainfall = random.randint(10, 60)
    elif location == 'Maharashtra':
        soil_type = random.choices(['Clayey', 'Loamy', 'Silty'], weights=[80, 15, 5])[0]
        N = random.randint(35, 75)
        P = random.randint(20, 50)
        K = random.randint(90, 140)
        ph = round(random.uniform(6.8, 8.0), 1)
        moisture = random.randint(35, 70)
        organic_carbon = round(random.uniform(0.45, 0.9), 2)
        temp = round(random.uniform(22.0, 38.0), 1)
        humidity = random.randint(40, 80)
        rainfall = random.randint(80, 180)
    elif location == 'Assam':
        soil_type = random.choices(['Peaty', 'Clayey', 'Loamy', 'Silty'], weights=[50, 30, 15, 5])[0]
        N = random.randint(75, 130)
        P = random.randint(10, 35)
        K = random.randint(50, 90)
        ph = round(random.uniform(4.5, 5.8), 1)
        moisture = random.randint(55, 90)
        organic_carbon = round(random.uniform(0.8, 1.6), 2)
        temp = round(random.uniform(18.0, 32.0), 1)
        humidity = random.randint(60, 95)
        rainfall = random.randint(180, 320)
    elif location == 'West Bengal':
        soil_type = random.choices(['Silty', 'Clayey', 'Loamy', 'Peaty'], weights=[60, 25, 10, 5])[0]
        N = random.randint(55, 100)
        P = random.randint(30, 65)
        K = random.randint(65, 115)
        ph = round(random.uniform(6.0, 7.0), 1)
        moisture = random.randint(45, 80)
        organic_carbon = round(random.uniform(0.6, 1.1), 2)
        temp = round(random.uniform(20.0, 36.0), 1)
        humidity = random.randint(50, 90)
        rainfall = random.randint(150, 280)
    elif location == 'Gujarat':
        soil_type = random.choices(['Clayey', 'Sandy', 'Loamy'], weights=[50, 30, 20])[0]
        N = random.randint(30, 70)
        P = random.randint(30, 60)
        K = random.randint(80, 130)
        ph = round(random.uniform(7.0, 8.2), 1)
        moisture = random.randint(25, 55)
        organic_carbon = round(random.uniform(0.35, 0.7), 2)
        temp = round(random.uniform(24.0, 40.0), 1)
        humidity = random.randint(30, 70)
        rainfall = random.randint(60, 150)
    elif location == 'Karnataka':
        soil_type = random.choices(['Loamy', 'Clayey', 'Sandy', 'Peaty'], weights=[60, 20, 15, 5])[0]
        N = random.randint(45, 85)
        P = random.randint(15, 45)
        K = random.randint(60, 110)
        ph = round(random.uniform(5.5, 6.8), 1)
        moisture = random.randint(30, 60)
        organic_carbon = round(random.uniform(0.5, 1.0), 2)
        temp = round(random.uniform(18.0, 32.0), 1)
        humidity = random.randint(45, 80)
        rainfall = random.randint(100, 220)
    elif location == 'Andhra Pradesh':
        soil_type = random.choices(['Sandy', 'Clayey', 'Loamy', 'Silty'], weights=[40, 35, 20, 5])[0]
        N = random.randint(30, 75)
        P = random.randint(25, 55)
        K = random.randint(70, 120)
        ph = round(random.uniform(6.5, 7.8), 1)
        moisture = random.randint(20, 50)
        organic_carbon = round(random.uniform(0.4, 0.75), 2)
        temp = round(random.uniform(22.0, 42.0), 1)
        humidity = random.randint(35, 75)
        rainfall = random.randint(80, 160)
    elif location == 'Tamil Nadu':
        soil_type = random.choices(['Sandy', 'Loamy', 'Clayey', 'Silty'], weights=[50, 30, 15, 5])[0]
        N = random.randint(40, 80)
        P = random.randint(30, 60)
        K = random.randint(60, 110)
        ph = round(random.uniform(6.0, 7.2), 1)
        moisture = random.randint(25, 55)
        organic_carbon = round(random.uniform(0.4, 0.8), 2)
        temp = round(random.uniform(22.0, 38.0), 1)
        humidity = random.randint(40, 80)
        rainfall = random.randint(90, 180)
    elif location == 'Madhya Pradesh':
        soil_type = random.choices(['Clayey', 'Loamy', 'Silty'], weights=[45, 45, 10])[0]
        N = random.randint(40, 85)
        P = random.randint(25, 55)
        K = random.randint(70, 120)
        ph = round(random.uniform(6.8, 7.8), 1)
        moisture = random.randint(25, 55)
        organic_carbon = round(random.uniform(0.35, 0.75), 2)
        temp = round(random.uniform(20.0, 38.0), 1)
        humidity = random.randint(30, 70)
        rainfall = random.randint(70, 130)
    elif location == 'Haryana':
        soil_type = random.choices(['Loamy', 'Sandy', 'Silty'], weights=[60, 25, 15])[0]
        N = random.randint(55, 110)
        P = random.randint(25, 60)
        K = random.randint(65, 115)
        ph = round(random.uniform(7.2, 8.2), 1)
        moisture = random.randint(25, 55)
        organic_carbon = round(random.uniform(0.35, 0.70), 2)
        temp = round(random.uniform(16.0, 39.0), 1)
        humidity = random.randint(30, 70)
        rainfall = random.randint(45, 90)
    elif location == 'Bihar':
        soil_type = random.choices(['Silty', 'Clayey', 'Loamy'], weights=[50, 30, 20])[0]
        N = random.randint(50, 95)
        P = random.randint(25, 50)
        K = random.randint(60, 110)
        ph = round(random.uniform(6.2, 7.4), 1)
        moisture = random.randint(40, 75)
        organic_carbon = round(random.uniform(0.50, 0.95), 2)
        temp = round(random.uniform(18.0, 36.0), 1)
        humidity = random.randint(45, 85)
        rainfall = random.randint(100, 180)
    elif location == 'Kerala':
        soil_type = random.choices(['Peaty', 'Loamy', 'Clayey'], weights=[50, 35, 15])[0]
        N = random.randint(60, 110)
        P = random.randint(15, 40)
        K = random.randint(50, 95)
        ph = round(random.uniform(4.8, 6.0), 1)
        moisture = random.randint(50, 85)
        organic_carbon = round(random.uniform(0.70, 1.40), 2)
        temp = round(random.uniform(22.0, 34.0), 1)
        humidity = random.randint(70, 95)
        rainfall = random.randint(200, 340)
    else:  # Uttar Pradesh
        soil_type = random.choices(['Silty', 'Loamy', 'Clayey', 'Sandy'], weights=[50, 38, 10, 2])[0]
        N = random.randint(50, 110)
        P = random.randint(30, 70)
        K = random.randint(60, 120)
        ph = round(random.uniform(6.8, 8.0), 1)
        moisture = random.randint(35, 65)
        organic_carbon = round(random.uniform(0.45, 0.8), 2)
        temp = round(random.uniform(18.0, 38.0), 1)
        humidity = random.randint(35, 75)
        rainfall = random.randint(80, 150)
        
    crops = ['Rice', 'Maize', 'Wheat', 'Cotton', 'Sugarcane', 'Tea', 'Potato', 'Tomato', 'Groundnut', 'Barley', 'Mustard', 'Soybeans', 'Onion', 'Garlic']
    crop_type = random.choice(crops)
    
    # Agronomic Decision Rules to select optimal Fertilizer
    # 1. Low Organic Carbon is critical for soil health -> Organic Compost
    if organic_carbon < 0.45:
        fertilizer = 'Organic Compost'
        qty = "800 kg/acre"
    # Gypsum: Highly alkaline soil
    elif ph > 8.0:
        fertilizer = 'Gypsum'
        qty = "150 kg/acre"
    # 2. Acidic soil + low Phosphorus -> SSP (Single Super Phosphate)
    elif ph < 5.8 and P < 45:
        fertilizer = 'SSP'
        qty = "120 kg/acre"
    # 3. High Alkaline soil + low Nitrogen -> Ammonium Sulfate (helps lower pH)
    elif ph > 7.6 and N < 50:
        fertilizer = 'Ammonium Sulfate'
        qty = "80 kg/acre"
    # 4. Extremely low Nitrogen, but P and K are okay -> Urea
    elif N < 40 and P >= 50 and K >= 50:
        fertilizer = 'Urea'
        qty = "50 kg/acre"
    # 5. Low Phosphorus and low-to-moderate Nitrogen -> DAP
    elif P < 40 and N < 70:
        fertilizer = 'DAP'
        qty = "75 kg/acre"
    # SOP: Low potassium for chloride-sensitive crops
    elif K < 50 and crop_type in ['Tea', 'Potato', 'Onion', 'Garlic']:
        fertilizer = 'SOP'
        qty = "50 kg/acre"
    # 6. Low Potassium -> MOP
    elif K < 40:
        fertilizer = 'MOP'
        qty = "60 kg/acre"
    # Zinc Sulfate: Balanced soil, but maize/tomato/garlic/onion need micronutrients
    elif N >= 65 and P >= 50 and K >= 50 and 5.8 <= ph <= 7.6 and crop_type in ['Maize', 'Tomato', 'Garlic', 'Onion']:
        fertilizer = 'Zinc Sulfate'
        qty = "10 kg/acre"
    # 7. Overall depletion of primary nutrients (N, P, K all low) -> NPK 19-19-19
    elif N < 60 and P < 60 and K < 60:
        fertilizer = 'NPK 19-19-19'
        qty = "100 kg/acre"
    # 8. Balanced soil, but minor Nitrogen top-up needed (common for cereal crops)
    elif N < 75:
        fertilizer = 'Urea'
        qty = "40 kg/acre"
    # 9. Otherwise, default to organic top-up or standard NPK depending on Crop
    else:
        if crop_type in ['Rice', 'Sugarcane', 'Cotton', 'Barley', 'Mustard', 'Soybeans']:
            fertilizer = 'NPK 19-19-19'
            qty = "80 kg/acre"
        else:
            fertilizer = 'Organic Compost'
            qty = "400 kg/acre"

    # Define base yields (in tons per acre)
    base_yields = {
        'Rice': 2.2, 'Wheat': 1.8, 'Maize': 2.5, 'Cotton': 1.2, 'Sugarcane': 35.0,
        'Tea': 0.9, 'Potato': 12.0, 'Tomato': 15.0, 'Groundnut': 1.4, 'Barley': 1.6,
        'Mustard': 0.8, 'Soybeans': 1.1, 'Onion': 10.0, 'Garlic': 4.5
    }
    base_yield = base_yields.get(crop_type, 2.0)
    
    # Calculate yield suitability scores
    nutrient_score = 0.6
    nutrient_score += min(N / 100.0, 1.2) * 0.1
    nutrient_score += min(P / 60.0, 1.2) * 0.1
    nutrient_score += min(K / 110.0, 1.2) * 0.1
    nutrient_score += min(organic_carbon / 1.0, 1.5) * 0.1
    
    ph_factor = 1.0
    if crop_type == 'Tea':
        if ph < 5.8:
            ph_factor = 1.15
        elif ph > 7.0:
            ph_factor = 0.6
    else:
        if 6.0 <= ph <= 7.3:
            ph_factor = 1.1
        elif ph > 8.0 or ph < 5.5:
            ph_factor = 0.8
            
    regional_factor = 1.0
    if location in ['Assam', 'Kerala']:
        if crop_type in ['Tea', 'Rice']:
            regional_factor = 1.2
    elif location in ['Punjab', 'Haryana', 'Uttar Pradesh']:
        if crop_type in ['Wheat', 'Barley', 'Potato', 'Mustard']:
            regional_factor = 1.25
    elif location == 'Rajasthan':
        if crop_type in ['Barley', 'Mustard', 'Onion', 'Garlic']:
            regional_factor = 1.15
        elif crop_type in ['Rice', 'Sugarcane']:
            regional_factor = 0.7
    elif location in ['Maharashtra', 'Gujarat', 'Madhya Pradesh']:
        if crop_type in ['Cotton', 'Soybeans', 'Sugarcane']:
            regional_factor = 1.2
            
    weather_factor = 1.0
    if crop_type in ['Rice', 'Sugarcane']:
        if moisture > 60 and rainfall > 150:
            weather_factor = 1.15
        elif moisture < 35 or rainfall < 80:
            weather_factor = 0.75
    elif crop_type in ['Barley', 'Mustard', 'Groundnut']:
        if moisture < 40:
            weather_factor = 1.1
        elif moisture > 70:
            weather_factor = 0.8
            
    fert_boost = 1.15 if fertilizer not in ['Organic Compost'] else 1.0
    if organic_carbon < 0.45 and fertilizer == 'Organic Compost':
        fert_boost = 1.1
        
    crop_yield = base_yield * nutrient_score * ph_factor * regional_factor * weather_factor * fert_boost
    crop_yield = crop_yield * random.uniform(0.88, 1.12)
    crop_yield = round(max(0.1, crop_yield), 2)
            
    return [N, P, K, ph, moisture, organic_carbon, soil_type, crop_type, location, temp, humidity, rainfall, crop_yield, fertilizer, qty]

def main():
    os.makedirs(os.path.dirname(__file__) or '.', exist_ok=True)
    dataset_path = os.path.join(os.path.dirname(__file__) or '.', 'dataset.csv')
    
    headers = [
        'N', 'P', 'K', 'pH', 'moisture', 'organic_carbon', 
        'soil_type', 'crop_type', 'location', 
        'temperature', 'humidity', 'rainfall', 
        'crop_yield', 'fertilizer', 'quantity'
    ]
    
    num_records = 12000
    print(f"Generating {num_records} synthetic agricultural records in {dataset_path}...")
    
    with open(dataset_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for _ in range(num_records):
            writer.writerow(generate_row())
            
    print("Dataset generation completed successfully!")

if __name__ == '__main__':
    main()
