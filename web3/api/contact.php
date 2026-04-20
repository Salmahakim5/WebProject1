<?php
header('Content-Type: application/json');
require_once '../config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'send-message':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $name = trim($data['name'] ?? '');
            $email = trim($data['email'] ?? '');
            $subject = trim($data['subject'] ?? '');
            $message = trim($data['message'] ?? '');
            
            if (empty($name) || empty($email) || empty($subject) || empty($message)) {
                echo json_encode(['success' => false, 'message' => 'All fields are required']);
                break;
            }
            
            // Validate email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Invalid email address']);
                break;
            }
            
            // Send email to admin
            $adminEmail = 'customerserv@gmail.com';
            $emailSubject = "New Contact Message: $subject";
            $emailBody = "From: $name ($email)\n\nSubject: $subject\n\nMessage:\n$message";
            $headers = "From: $email\r\n";
            
            if (mail($adminEmail, $emailSubject, $emailBody, $headers)) {
                echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to send message']);
            }
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>