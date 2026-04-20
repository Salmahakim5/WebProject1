<?php
header('Content-Type: application/json');
require_once '../config.php';
require_once '../auth.php';

if (!UserAuth::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user = UserAuth::getCurrentUser();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'update-profile':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $fullName = trim($data['fullName'] ?? '');
            
            if (empty($fullName)) {
                echo json_encode(['success' => false, 'message' => 'Full name is required']);
                break;
            }
            
            $stmt = $conn->prepare("UPDATE users SET full_name = ? WHERE id = ?");
            $stmt->bind_param("si", $fullName, $user['id']);
            
            if ($stmt->execute()) {
                $_SESSION['user_name'] = $fullName;
                echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
            }
        }
        break;
        
    case 'update-photo':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $photoData = $_POST['photo'] ?? null;
            
            if (!$photoData) {
                echo json_encode(['success' => false, 'message' => 'Photo is required']);
                break;
            }
            
            $photoPath = savePhoto($photoData, 'profile');
            
            $stmt = $conn->prepare("UPDATE users SET photo_path = ? WHERE id = ?");
            $stmt->bind_param("si", $photoPath, $user['id']);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Photo updated successfully', 'photo_path' => $photoPath]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update photo']);
            }
        }
        break;
        
    case 'get-profile':
        $stmt = $conn->prepare("SELECT id, full_name, email, photo_path, language FROM users WHERE id = ?");
        $stmt->bind_param("i", $user['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $profile = $result->fetch_assoc();
            echo json_encode(['success' => true, 'profile' => $profile]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Profile not found']);
        }
        break;
        
    case 'update-language':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $language = trim($data['language'] ?? 'en');
            
            $allowedLanguages = ['en', 'ar', 'es', 'fr'];
            if (!in_array($language, $allowedLanguages)) {
                echo json_encode(['success' => false, 'message' => 'Invalid language']);
                break;
            }
            
            $stmt = $conn->prepare("UPDATE users SET language = ? WHERE id = ?");
            $stmt->bind_param("si", $language, $user['id']);
            
            if ($stmt->execute()) {
                $_SESSION['language'] = $language;
                echo json_encode(['success' => true, 'message' => 'Language updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update language']);
            }
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function savePhoto($photoData, $folder = 'profile') {
    if (strpos($photoData, 'data:image') === 0) {
        list($type, $photoData) = explode(';', $photoData);
        list(, $photoData) = explode(',', $photoData);
        $photoData = base64_decode($photoData);
    }
    
    $uploadDir = "../uploads/{$folder}/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $filename = uniqid() . '.jpg';
    $filepath = $uploadDir . $filename;
    
    file_put_contents($filepath, $photoData);
    
    return $filepath;
}
?>