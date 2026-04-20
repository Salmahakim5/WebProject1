<?php
header('Content-Type: application/json');
require_once '../config.php';
require_once '../auth.php';

$auth = new UserAuth($conn);
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $auth->register(
                $data['fullName'] ?? '',
                $data['email'] ?? '',
                $data['password'] ?? '',
                $data['language'] ?? 'en'
            );
            echo json_encode($result);
        }
        break;
        
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $auth->login(
                $data['email'] ?? '',
                $data['password'] ?? ''
            );
            echo json_encode($result);
        }
        break;
        
    case 'logout':
        $result = $auth->logout();
        echo json_encode($result);
        break;
        
    case 'current-user':
        $user = UserAuth::getCurrentUser();
        if ($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Not logged in']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>