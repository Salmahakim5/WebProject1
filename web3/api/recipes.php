<?php
header('Content-Type: application/json');
require_once '../config.php';
require_once '../auth.php';
require_once '../recipe.php';

// Check authentication
if (!UserAuth::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user = UserAuth::getCurrentUser();
$recipeManager = new RecipeManager($conn);
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $photoPath = null;
            if (!empty($data['photo'])) {
                $photoPath = savePhoto($data['photo']);
            }
            
            $result = $recipeManager->createRecipe(
                $user['id'],
                $data['title'] ?? '',
                $data['category'] ?? '',
                $data['subcategory'] ?? '',
                $data['ingredients'] ?? '',
                $data['steps'] ?? '',
                $photoPath
            );
            echo json_encode($result);
        }
        break;
        
    case 'get-user-recipes':
        $result = $recipeManager->getUserRecipes($user['id']);
        echo json_encode($result);
        break;
        
    case 'get-recipe':
        $recipeId = $_GET['id'] ?? null;
        if ($recipeId) {
            $result = $recipeManager->getRecipeById($recipeId);
            echo json_encode($result);
        }
        break;
        
    case 'update':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $recipeId = $data['id'] ?? null;
            
            $photoPath = null;
            if (!empty($data['photo'])) {
                $photoPath = savePhoto($data['photo']);
            }
            
            $result = $recipeManager->updateRecipe(
                $recipeId,
                $user['id'],
                $data['title'] ?? '',
                $data['category'] ?? '',
                $data['subcategory'] ?? '',
                $data['ingredients'] ?? '',
                $data['steps'] ?? '',
                $photoPath
            );
            echo json_encode($result);
        }
        break;
        
    case 'delete':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $recipeId = $data['id'] ?? null;
            
            $result = $recipeManager->deleteRecipe($recipeId, $user['id']);
            echo json_encode($result);
        }
        break;
        
    case 'search':
        $keyword = $_GET['keyword'] ?? '';
        $category = $_GET['category'] ?? null;
        $result = $recipeManager->searchRecipes($keyword, $category);
        echo json_encode($result);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

// Helper function to save photo
function savePhoto($photoData) {
    // Remove data URI scheme if present
    if (strpos($photoData, 'data:image') === 0) {
        list($type, $photoData) = explode(';', $photoData);
        list(, $photoData) = explode(',', $photoData);
        $photoData = base64_decode($photoData);
    }
    
    $uploadDir = '../uploads/recipes/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $filename = uniqid() . '.jpg';
    $filepath = $uploadDir . $filename;
    
    file_put_contents($filepath, $photoData);
    
    return $filepath;
}
?>