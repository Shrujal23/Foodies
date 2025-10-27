-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create collection_recipes table for mapping recipes to collections
CREATE TABLE IF NOT EXISTS collection_recipes (
  collection_id INT,
  recipe_id VARCHAR(255),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, recipe_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- Create collection_user_recipes table for mapping user-created recipes to collections
CREATE TABLE IF NOT EXISTS collection_user_recipes (
  collection_id INT,
  user_recipe_id INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, user_recipe_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (user_recipe_id) REFERENCES user_recipes(id) ON DELETE CASCADE
);