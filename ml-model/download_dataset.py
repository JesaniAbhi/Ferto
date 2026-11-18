import kagglehub
import os
import shutil

def main():
    print("Downloading Fertilizer Prediction dataset from Kaggle...")
    path = kagglehub.dataset_download("gdabhishek/fertilizer-prediction")
    print(f"Dataset downloaded to cache at: {path}")
    
    target_dir = os.path.dirname(__file__) or '.'
    target_path = os.path.join(target_dir, 'raw_fertilizer_data.csv')
    
    for file in os.listdir(path):
        if file.endswith('.csv'):
            source_file = os.path.join(path, file)
            shutil.copy(source_file, target_path)
            print(f"Successfully copied real dataset to {target_path}")
            return
            
    print("Error: Could not find CSV file in downloaded dataset.")

if __name__ == "__main__":
    main()
