-- SQL Schema for Smart Fertilizer Recommendation Engine
-- Target Database: PostgreSQL

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER'
);

-- Create Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    nitrogen DOUBLE PRECISION NOT NULL,
    phosphorus DOUBLE PRECISION NOT NULL,
    potassium DOUBLE PRECISION NOT NULL,
    ph DOUBLE PRECISION NOT NULL,
    moisture DOUBLE PRECISION NOT NULL,
    organic_carbon DOUBLE PRECISION NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,
    humidity DOUBLE PRECISION NOT NULL,
    rainfall DOUBLE PRECISION NOT NULL,
    predicted_fertilizer VARCHAR(100) NOT NULL,
    recommended_quantity VARCHAR(50) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
