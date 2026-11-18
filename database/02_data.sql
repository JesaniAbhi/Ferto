-- Seed data for testing the Smart Fertilizer Recommendation Engine

-- Insert default admin (password: admin123)
-- BCrypt hash of admin123: $2b$10$I5gZW5wXdA6wsVmrb/2To.tuoMvDSbzGZixnSyzgTcqsKwwpF0mQ.
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@agriengine.com', '$2b$10$I5gZW5wXdA6wsVmrb/2To.tuoMvDSbzGZixnSyzgTcqsKwwpF0mQ.', 'ROLE_ADMIN')
ON CONFLICT (username) DO NOTHING;

-- Insert default user/farmer (password: farmer123)
-- BCrypt hash of farmer123: $2b$10$Ln3ymk3ETR/TdDTXRD6bxeJU3hiQ8zaRPzaz5Iewsmy5t6DxvREMi
INSERT INTO users (username, email, password, role)
VALUES ('farmer', 'farmer@agriengine.com', '$2b$10$Ln3ymk3ETR/TdDTXRD6bxeJU3hiQ8zaRPzaz5Iewsmy5t6DxvREMi', 'ROLE_USER')
ON CONFLICT (username) DO NOTHING;
