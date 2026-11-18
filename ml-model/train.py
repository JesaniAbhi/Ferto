import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, accuracy_score, r2_score, mean_squared_error
import joblib
import os

def main():
    model_dir = os.path.dirname(__file__) or '.'
    csv_path = os.path.join(model_dir, 'dataset.csv')
    
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Running dataset generator first...")
        import generate_dataset
        generate_dataset.main()
        
    df = pd.read_csv(csv_path, encoding='utf-8')
    
    # Preprocessing
    categorical_cols = ['soil_type', 'crop_type', 'location']
    encoders = {}
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le
        # print(f"Encoded '{col}' categories: {list(le.classes_)}")
        
    X = df.drop(columns=['fertilizer', 'quantity', 'crop_yield', 'crop_type'])
    y_clf = df['fertilizer']
    y_reg = df['crop_yield']
    y_crop = df['crop_type']
    
    # Train-test split
    y_joint = pd.concat([y_clf, y_reg, y_crop], axis=1)
    X_train, X_test, y_train, y_test = train_test_split(X, y_joint, test_size=0.2, random_state=42)
    
    y_train_clf = y_train['fertilizer']
    y_test_clf = y_test['fertilizer']
    y_train_reg = y_train['crop_yield']
    y_test_reg = y_test['crop_yield']
    y_train_crop = y_train['crop_type']
    y_test_crop = y_test['crop_type']
    
    # Scaling numerical features
    scaler = StandardScaler()
    numerical_cols = ['N', 'P', 'K', 'pH', 'moisture', 'organic_carbon', 'temperature', 'humidity', 'rainfall']
    
    # Scale only the numeric columns
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()
    
    X_train_scaled[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
    X_test_scaled[numerical_cols] = scaler.transform(X_test[numerical_cols])
    
    # 1. Classification Model for Fertilizer
    print("\nPerforming Hyperparameter Tuning for Random Forest Classifier...")
    clf_param_grid = {
        'n_estimators': [50, 100, 200, 300],
        'max_depth': [None, 10, 15, 20, 25],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    base_clf = RandomForestClassifier(random_state=42)
    clf_search = RandomizedSearchCV(estimator=base_clf, param_distributions=clf_param_grid, 
                                   n_iter=15, cv=3, verbose=1, random_state=42, n_jobs=-1)
    
    clf_search.fit(X_train_scaled, y_train_clf)
    model = clf_search.best_estimator_
    print(f"\nBest Classifier Parameters: {clf_search.best_params_}")
    
    # Evaluation
    y_pred_clf = model.predict(X_test_scaled)
    acc = accuracy_score(y_test_clf, y_pred_clf)
    print(f"\nModel Validation Accuracy (Fertilizer): {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test_clf, y_pred_clf))
    
    # 2. Regression Model for Crop Yield
    print("\nPerforming Hyperparameter Tuning for Random Forest Regressor...")
    reg_param_grid = {
        'n_estimators': [50, 100, 200, 300],
        'max_depth': [None, 10, 15, 20, 25],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    base_reg = RandomForestRegressor(random_state=42)
    reg_search = RandomizedSearchCV(estimator=base_reg, param_distributions=reg_param_grid, 
                                   n_iter=15, cv=3, verbose=1, random_state=42, n_jobs=-1)
                                   
    reg_search.fit(X_train_scaled, y_train_reg)
    yield_model = reg_search.best_estimator_
    print(f"\nBest Regressor Parameters: {reg_search.best_params_}")
    
    # Evaluation
    y_pred_reg = yield_model.predict(X_test_scaled)
    r2 = r2_score(y_test_reg, y_pred_reg)
    mse = mean_squared_error(y_test_reg, y_pred_reg)
    print(f"\nModel Validation R2 Score (Yield): {r2:.4f}")
    print(f"Model Validation MSE (Yield): {mse:.4f} (Avg absolute error: {np.sqrt(mse):.2f} tons/acre)")
    
    # 3. Classification Model for Crop Type
    print("\nPerforming Hyperparameter Tuning for Crop Recommendation Model...")
    crop_search = RandomizedSearchCV(estimator=base_clf, param_distributions=clf_param_grid, 
                                   n_iter=15, cv=3, verbose=1, random_state=42, n_jobs=-1)
    crop_search.fit(X_train_scaled, y_train_crop)
    crop_model = crop_search.best_estimator_
    print(f"\nBest Crop Classifier Parameters: {crop_search.best_params_}")
    
    y_pred_crop = crop_model.predict(X_test_scaled)
    crop_acc = accuracy_score(y_test_crop, y_pred_crop)
    print(f"\nModel Validation Accuracy (Crop): {crop_acc * 100:.2f}%")
    
    # Save the artifacts
    joblib.dump(model, os.path.join(model_dir, 'model.joblib'))
    joblib.dump(yield_model, os.path.join(model_dir, 'yield_model.joblib'))
    joblib.dump(crop_model, os.path.join(model_dir, 'crop_model.joblib'))
    joblib.dump(scaler, os.path.join(model_dir, 'scaler.joblib'))
    joblib.dump(encoders, os.path.join(model_dir, 'encoders.joblib'))
    
    print("\nModel and preprocessing artifacts saved successfully:")
    print(f"- model.joblib\n- yield_model.joblib\n- crop_model.joblib\n- scaler.joblib\n- encoders.joblib")

if __name__ == '__main__':
    main()
