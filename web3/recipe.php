<?php
require_once 'config.php';

class RecipeManager {
    private $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    // Create a new recipe
    public function createRecipe($userId, $title, $category, $subcategory, $ingredients, $steps, $photoPath = null) {
        $title = trim($title);
        $category = trim($category);
        $subcategory = trim($subcategory);
        $ingredients = trim($ingredients);
        $steps = trim($steps);
        
        // Validate input
        if (empty($title) || empty($category) || empty($subcategory) || empty($ingredients) || empty($steps)) {
            return ['success' => false, 'message' => 'All fields are required'];
        }
        
        // Insert recipe
        $stmt = $this->conn->prepare("INSERT INTO recipes (user_id, title, category, subcategory, ingredients, steps, photo_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("issssss", $userId, $title, $category, $subcategory, $ingredients, $steps, $photoPath);
        
        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Recipe created successfully',
                'recipe_id' => $this->conn->insert_id
            ];
        } else {
            return ['success' => false, 'message' => 'Failed to create recipe'];
        }
    }
    
    // Get user recipes
    public function getUserRecipes($userId) {
        $stmt = $this->conn->prepare("SELECT id, title, category, subcategory, ingredients, steps, photo_path, created_at FROM recipes WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        
        return ['success' => true, 'recipes' => $recipes];
    }
    
    // Get recipe by ID
    public function getRecipeById($recipeId) {
        $stmt = $this->conn->prepare("SELECT * FROM recipes WHERE id = ?");
        $stmt->bind_param("i", $recipeId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'Recipe not found'];
        }
        
        return ['success' => true, 'recipe' => $result->fetch_assoc()];
    }
    
    // Update recipe
    public function updateRecipe($recipeId, $userId, $title, $category, $subcategory, $ingredients, $steps, $photoPath = null) {
        // Verify ownership
        $stmt = $this->conn->prepare("SELECT user_id FROM recipes WHERE id = ?");
        $stmt->bind_param("i", $recipeId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'Recipe not found'];
        }
        
        $recipe = $result->fetch_assoc();
        if ($recipe['user_id'] !== $userId) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }
        
        // Update recipe
        if ($photoPath) {
            $stmt = $this->conn->prepare("UPDATE recipes SET title = ?, category = ?, subcategory = ?, ingredients = ?, steps = ?, photo_path = ? WHERE id = ?");
            $stmt->bind_param("ssssssi", $title, $category, $subcategory, $ingredients, $steps, $photoPath, $recipeId);
        } else {
            $stmt = $this->conn->prepare("UPDATE recipes SET title = ?, category = ?, subcategory = ?, ingredients = ?, steps = ? WHERE id = ?");
            $stmt->bind_param("sssssi", $title, $category, $subcategory, $ingredients, $steps, $recipeId);
        }
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Recipe updated successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to update recipe'];
        }
    }
    
    // Delete recipe
    public function deleteRecipe($recipeId, $userId) {
        // Verify ownership
        $stmt = $this->conn->prepare("SELECT user_id, photo_path FROM recipes WHERE id = ?");
        $stmt->bind_param("i", $recipeId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'Recipe not found'];
        }
        
        $recipe = $result->fetch_assoc();
        if ($recipe['user_id'] !== $userId) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }
        
        // Delete photo if exists
        if ($recipe['photo_path'] && file_exists($recipe['photo_path'])) {
            unlink($recipe['photo_path']);
        }
        
        // Delete recipe
        $stmt = $this->conn->prepare("DELETE FROM recipes WHERE id = ?");
        $stmt->bind_param("i", $recipeId);
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Recipe deleted successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to delete recipe'];
        }
    }
    
    // Search recipes
    public function searchRecipes($keyword, $category = null, $limit = 20) {
        $keyword = "%{$keyword}%";
        
        if ($category) {
            $stmt = $this->conn->prepare("SELECT * FROM recipes WHERE (title LIKE ? OR ingredients LIKE ? OR steps LIKE ?) AND category = ? ORDER BY created_at DESC LIMIT ?");
            $stmt->bind_param("ssssi", $keyword, $keyword, $keyword, $category, $limit);
        } else {
            $stmt = $this->conn->prepare("SELECT * FROM recipes WHERE title LIKE ? OR ingredients LIKE ? OR steps LIKE ? ORDER BY created_at DESC LIMIT ?");
            $stmt->bind_param("sssi", $keyword, $keyword, $keyword, $limit);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        
        return ['success' => true, 'recipes' => $recipes];
    }
}
?>