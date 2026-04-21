CREATE DATABASE farmtech;

USE farmtech;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255),
  farmSize VARCHAR(50),
  location VARCHAR(100),
  soil VARCHAR(100)
);
select * from users;