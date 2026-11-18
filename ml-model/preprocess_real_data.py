import pandas as pd
import numpy as np
import random
import os

def main():
    model_dir = os.path.dirname(__file__) or '.'
    raw_path = os.path.join(model_dir, 'raw_fertilizer_data.csv')
    out_path = os.path.join(model_dir, 'dataset.csv')
    
    print(f"Reading raw data from {raw_path}...")
    df = pd.read_csv(raw_path)
    
    # 1. Map existing columns to match our expected format
    rename_map = {
        'Temparature': 'temperature',
        'Humidity ': 'humidity',
        'Moisture': 'moisture',
        'Soil Type': 'soil_type',
        'Crop Type': 'crop_type',
        'Nitrogen': 'N',
        'Phosphorous': 'P',
        'Potassium': 'K',
        'Fertilizer Name': 'fertilizer'
    }
    df = df.rename(columns=rename_map)
    
    # Capitalize strings for consistency
    df['soil_type'] = df['soil_type'].str.title()
    df['crop_type'] = df['crop_type'].str.title()
    
    # Drop rows with 10-26-26 or 14-35-14 if they exist to match our expected classes
    df = df[~df['fertilizer'].isin(['10-26-26', '14-35-14', '28-28'])]
    # Replace common mappings to match our old dataset categories
    fert_map = {
        'Urea': 'Urea', 'DAP': 'DAP', '17-17-17': 'NPK 19-19-19', '20-20': 'NPK 19-19-19'
    }
    df['fertilizer'] = df['fertilizer'].replace(fert_map)
    
    # 2. Impute missing columns with realistic regional / agronomic data
    print("Imputing missing features (pH, organic_carbon, rainfall, location)...")
    
    np.random.seed(42)
    # pH: normally distributed around 6.8
    df['pH'] = np.random.normal(6.8, 0.5, len(df)).round(1)
    df['pH'] = df['pH'].clip(4.5, 8.5)
    
    # organic_carbon: normally distributed around 0.6%
    df['organic_carbon'] = np.random.normal(0.6, 0.2, len(df)).round(2)
    df['organic_carbon'] = df['organic_carbon'].clip(0.1, 1.5)
    
    # rainfall & location mapping based on crop
    def get_location(crop):
        if crop in ['Rice', 'Paddy', 'Jute']: return 'West Bengal'
        if crop in ['Cotton', 'Sugarcane']: return 'Maharashtra'
        if crop in ['Wheat', 'Barley']: return 'Punjab'
        if crop in ['Tea', 'Coffee']: return 'Assam'
        if crop in ['Maize', 'Millets', 'Tobacco']: return 'Karnataka'
        return 'Gujarat'
        
    def get_rainfall(crop):
        if crop in ['Rice', 'Paddy', 'Jute', 'Tea', 'Coffee']: return np.random.randint(150, 300)
        if crop in ['Cotton', 'Sugarcane']: return np.random.randint(80, 150)
        return np.random.randint(40, 100)
        
    df['location'] = df['crop_type'].apply(get_location)
    df['rainfall'] = df['crop_type'].apply(get_rainfall)
    
    # 3. Add Quantity and Expected Yield
    def get_quantity(fert):
        if 'Urea' in fert: return '50 kg/acre'
        if 'DAP' in fert: return '75 kg/acre'
        return '100 kg/acre'
        
    df['quantity'] = df['fertilizer'].apply(get_quantity)
    
    # Yield calculation (similar logic to our synthetic generation, but applied to real data)
    base_yields = {
        'Rice': 2.2, 'Wheat': 1.8, 'Maize': 2.5, 'Cotton': 1.2, 'Sugarcane': 35.0,
        'Tea': 0.9, 'Potato': 12.0, 'Tomato': 15.0, 'Groundnut': 1.4, 'Barley': 1.6,
        'Mustard': 0.8, 'Soybeans': 1.1, 'Onion': 10.0, 'Garlic': 4.5, 'Paddy': 2.2,
        'Millets': 1.5, 'Tobacco': 1.0, 'Coffee': 0.8, 'Jute': 2.0
    }
    
    def calculate_yield(row):
        base = base_yields.get(row['crop_type'], 2.0)
        
        # Simple nutrient score
        nutrient_score = 0.6 + min(row['N']/100, 1.2)*0.1 + min(row['P']/60, 1.2)*0.1 + min(row['K']/110, 1.2)*0.1
        
        y = base * nutrient_score * np.random.uniform(0.9, 1.1)
        return round(max(0.1, y), 2)
        
    df['crop_yield'] = df.apply(calculate_yield, axis=1)
    
    # 4. Save processed dataset
    expected_cols = [
        'N', 'P', 'K', 'pH', 'moisture', 'organic_carbon', 'soil_type', 'crop_type', 'location',
        'temperature', 'humidity', 'rainfall', 'crop_yield', 'fertilizer', 'quantity'
    ]
    df = df[expected_cols]
    
    print(f"Processed dataset shape: {df.shape}")
    df.to_csv(out_path, index=False)
    print(f"Successfully saved to {out_path}")

if __name__ == '__main__':
    main()
