-- Bookmarks/Collections table
CREATE TABLE IF NOT EXISTS collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_collection (user_id, name)
);

-- Collection items (bookmarks)
CREATE TABLE IF NOT EXISTS collection_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  collection_id INT NOT NULL,
  recipe_id INT,
  recipe_type VARCHAR(20), -- 'user' or 'edamam'
  external_recipe_id VARCHAR(500), -- For Edamam recipes
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES user_recipes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_collection_recipe (collection_id, recipe_id, external_recipe_id)
);

-- Dietary preferences/filters
CREATE TABLE IF NOT EXISTS dietary_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100),
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User dietary filters
CREATE TABLE IF NOT EXISTS user_dietary_filters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) NOT NULL,
  dietary_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (dietary_id) REFERENCES dietary_preferences(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_dietary (user_id, dietary_id)
);

-- Insert default dietary preferences
INSERT IGNORE INTO dietary_preferences (name, label, icon) VALUES
  ('vegan', 'Vegan', '🌱'),
  ('vegetarian', 'Vegetarian', '🥬'),
  ('gluten_free', 'Gluten Free', '🌾'),
  ('dairy_free', 'Dairy Free', '🚫'),
  ('nut_free', 'Nut Free', '🥜'),
  ('low_carb', 'Low Carb', '📊'),
  ('keto', 'Keto', '🥑'),
  ('paleo', 'Paleo', '🍖'),
  ('high_protein', 'High Protein', '💪'),
  ('quick_easy', 'Quick & Easy', '⚡');

-- Recipe photos (for photo reviews)
CREATE TABLE IF NOT EXISTS recipe_photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_id INT,
  user_id VARCHAR(255) NOT NULL,
  recipe_id INT NOT NULL,
  photo_url VARCHAR(500) NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES user_recipes(id) ON DELETE CASCADE
);
