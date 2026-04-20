<?php

/**
 * Sanitize string input
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Hash password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate token
 */
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

/**
 * Check if file is image
 */
function isValidImage($filePath) {
    $validMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $filePath);
    finfo_close($finfo);
    
    return in_array($mime, $validMimes);
}

/**
 * Get file extension
 */
function getFileExtension($filename) {
    return pathinfo($filename, PATHINFO_EXTENSION);
}

/**
 * Log activity
 */
function logActivity($userId, $action, $description) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO activity_logs (user_id, action, description, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("iss", $userId, $action, $description);
    return $stmt->execute();
}

/**
 * Send JSON response
 */
function jsonResponse($success, $message, $data = []) {
    header('Content-Type: application/json');
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if (!empty($data)) {
        $response = array_merge($response, $data);
    }
    
    echo json_encode($response);
    exit;
}

/**
 * Get client IP
 */
function getClientIp() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return filter_var($ip, FILTER_VALIDATE_IP);
}
?>