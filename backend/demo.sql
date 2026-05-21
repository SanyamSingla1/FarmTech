-- FarmTech Database Setup
-- Complete SQL schema for all farming application features

-- Create Database
CREATE DATABASE IF NOT EXISTS farmtech;
USE farmtech;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  landSize FLOAT,
  location VARCHAR(255),
  soilType VARCHAR(50),
  profileImage VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crops Table
CREATE TABLE IF NOT EXISTS crops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  cropName VARCHAR(100) NOT NULL,
  cropType VARCHAR(100),
  plantingDate DATE,
  expectedHarvestDate DATE,
  soilType VARCHAR(50),
  areaPlanted FLOAT,
  growthStage VARCHAR(50),
  quantity INT,
  unit VARCHAR(20),
  status VARCHAR(50) DEFAULT 'growing',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  cropId INT,
  taskType VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  dueDate DATE,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  completedDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cropId) REFERENCES crops(id) ON DELETE SET NULL
);

-- Irrigation Alerts Table
CREATE TABLE IF NOT EXISTS irrigationAlerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  cropId INT,
  alertLevel VARCHAR(20),
  moistureLevel FLOAT,
  recommendedWaterAmount FLOAT,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  readAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cropId) REFERENCES crops(id) ON DELETE SET NULL
);

-- Fertilizer Recommendations Table
CREATE TABLE IF NOT EXISTS fertilizerRecommendations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  cropId INT,
  soilType VARCHAR(50),
  growthStage VARCHAR(50),
  fertilizerType VARCHAR(100),
  nitrogen FLOAT,
  phosphorus FLOAT,
  potassium FLOAT,
  applicationMethod VARCHAR(100),
  frequency VARCHAR(100),
  dosage VARCHAR(100),
  notes TEXT,
  isApplied BOOLEAN DEFAULT FALSE,
  appliedDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cropId) REFERENCES crops(id) ON DELETE SET NULL
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  isRead BOOLEAN DEFAULT FALSE,
  sentViaEmail BOOLEAN DEFAULT FALSE,
  sentViaSMS BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  readAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Chatbot Conversations Table
CREATE TABLE IF NOT EXISTS chatbotConversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  userMessage TEXT NOT NULL,
  aiResponse TEXT NOT NULL,
  category VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Disease Detection Records Table
CREATE TABLE IF NOT EXISTS diseaseDetections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  cropId INT,
  imageUrl VARCHAR(255),
  disease VARCHAR(100),
  confidence FLOAT,
  description TEXT,
  treatment TEXT,
  severity VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cropId) REFERENCES crops(id) ON DELETE SET NULL
);

-- Weather Data Table
CREATE TABLE IF NOT EXISTS weatherData (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  location VARCHAR(255),
  temperature FLOAT,
  humidity FLOAT,
  rainfall FLOAT,
  windSpeed FLOAT,
  weatherCondition VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample Data for Testing (Optional)
-- INSERT INTO users (username, email, password, landSize, location, soilType) 
-- VALUES ('farmer1', 'farmer1@example.com', 'hashed_password', 5.5, 'Punjab', 'loamy');

-- Create Indexes for Better Performance
CREATE INDEX idx_user_id ON crops(userId);
CREATE INDEX idx_user_id_tasks ON tasks(userId);
CREATE INDEX idx_user_id_irrigation ON irrigationAlerts(userId);
CREATE INDEX idx_user_id_fertilizer ON fertilizerRecommendations(userId);
CREATE INDEX idx_user_id_notifications ON notifications(userId);
CREATE INDEX idx_user_id_chatbot ON chatbotConversations(userId);
CREATE INDEX idx_user_id_disease ON diseaseDetections(userId);
CREATE INDEX idx_user_id_weather ON weatherData(userId);
