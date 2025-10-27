CREATE TABLE IF NOT EXISTS user_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  activity_type ENUM('search', 'favorite', 'unfavorite', 'view') NOT NULL,
  recipe_id VARCHAR(255),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);