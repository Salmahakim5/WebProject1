<?php
header('Content-Type: application/json');
require_once '../config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get-all-recipes':
        $limit = intval($_GET['limit'] ?? 50);
        $offset = intval($_GET['offset'] ?? 0);
        
        $stmt = $conn->prepare("SELECT r.*, u.full_name FROM recipes r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT ? OFFSET ?");
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        
        echo json_encode(['success' => true, 'recipes' => $recipes]);
        break;
        
    case 'get-by-category':
        $category = trim($_GET['category'] ?? '');
        $limit = intval($_GET['limit'] ?? 50);
        $offset = intval($_GET['offset'] ?? 0);
        
        if (empty($category)) {
            echo json_encode(['success' => false, 'message' => 'Category is required']);
            break;
        }
        
        $stmt = $conn->prepare("SELECT r.*, u.full_name FROM recipes r JOIN users u ON r.user_id = u.id WHERE r.category = ? ORDER BY r.created_at DESC LIMIT ? OFFSET ?");
        $stmt->bind_param("sii", $category, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        
        echo json_encode(['success' => true, 'recipes' => $recipes]);
        break;
        
    case 'get-by-subcategory':
        $subcategory = trim($_GET['subcategory'] ?? '');
        $limit = intval($_GET['limit'] ?? 50);
        $offset = intval($_GET['offset'] ?? 0);
        
        if (empty($subcategory)) {
            echo json_encode(['success' => false, 'message' => 'Subcategory is required']);
            break;
        }
        
        $stmt = $conn->prepare("SELECT r.*, u.full_name FROM recipes r JOIN users u ON r.user_id = u.id WHERE r.subcategory = ? ORDER BY r.created_at DESC LIMIT ? OFFSET ?");
        $stmt->bind_param("sii", $subcategory, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        
        echo json_encode(['success' => true, 'recipes' => $recipes]);
        break;
        
    case 'search':
        $keyword = trim($_GET['keyword'] ?? '');
        $limit = intval($_GET['limit'] ?? 50);
        $offset = intval($_GET['offset'] ?? 0);
        
        if (empty($keyword)) {
            echo json_encode(['success' => false, 'message' => 'Search keyword is required']);
            break;
        }
        
        $searchTerm = "%{$keyword}%";
        $stmt = $conn->prepare("SELECT r.*, u.full_name FROM recipes r JOIN users u ON r.user_id = u.id WHERE MATCH(r.title, r.ingredients, r.steps) AGAINST(? IN BOOLEAN MODE) ORDER BY r.created_at DESC LIMIT ? OFFSET ?");
        $stmt->bind_param("sii", $keyword, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        
        echo json_encode(['success' => true, 'recipes' => $recipes]);
        break;
        
    case 'get-categories':
        $stmt = $conn->prepare("SELECT DISTINCT category FROM recipes ORDER BY category");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row['category'];
        }
        
        echo json_encode(['success' => true, 'categories' => $categories]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>