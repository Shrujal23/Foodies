-- Create recipes table (for Edamam API recipes)
CREATE TABLE IF NOT EXISTS recipes (
  recipe_id VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  image TEXT,
  source VARCHAR(255),
  url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id VARCHAR(255),
  recipe_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, recipe_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- Create user_recipes table (for user-created recipes)
CREATE TABLE IF NOT EXISTS user_recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  prep_time INT NOT NULL,
  cook_time INT NOT NULL,
  servings INT NOT NULL,
  ingredients JSON NOT NULL,
  instructions JSON NOT NULL,
  image VARCHAR(500),
  difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  cuisine VARCHAR(100) DEFAULT 'international',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
