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
    case 'submit-rating':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $rating = intval($data['rating'] ?? 0);
            
            if ($rating < 1 || $rating > 5) {
                echo json_encode(['success' => false, 'message' => 'Invalid rating']);
                break;
            }
            
            $stmt = $conn->prepare("INSERT INTO feedback (user_id, rating) VALUES (?, ?)");
            $stmt->bind_param("ii", $user['id'], $rating);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Thank you for your rating!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to submit rating']);
            }
        }
        break;
        
    case 'submit-report':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $subject = trim($data['subject'] ?? '');
            $message = trim($data['message'] ?? '');
            
            if (empty($subject) || empty($message)) {
                echo json_encode(['success' => false, 'message' => 'Subject and message are required']);
                break;
            }
            
            $stmt = $conn->prepare("INSERT INTO feedback (user_id, message) VALUES (?, ?)");
            $fullMessage = "REPORT - Subject: $subject\n\n$message";
            $stmt->bind_param("is", $user['id'], $fullMessage);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Report submitted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to submit report']);
            }
        }
        break;
        
    case 'get-feedback':
        if ($_SESSION['user_id'] == 1) { // Admin only
            $stmt = $conn->prepare("SELECT f.*, u.full_name, u.email FROM feedback f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC LIMIT 100");
            $stmt->execute();
            $result = $stmt->get_result();
            
            $feedback = [];
            while ($row = $result->fetch_assoc()) {
                $feedback[] = $row;
            }
            
            echo json_encode(['success' => true, 'feedback' => $feedback]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Admin access only']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>