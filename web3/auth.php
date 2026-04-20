<?php
require_once 'config.php';

class UserAuth {
    private $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    // Register a new user
    public function register($fullName, $email, $password, $language = 'en') {
        $email = strtolower(trim($email));
        $fullName = trim($fullName);
        
        // Validate input
        if (empty($fullName) || empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'All fields are required'];
        }
        
        // Check if email already exists
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            return ['success' => false, 'message' => 'Email already registered'];
        }
        
        // Hash password
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        
        // Insert user
        $stmt = $this->conn->prepare("INSERT INTO users (full_name, email, password_hash, language, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->bind_param("ssss", $fullName, $email, $passwordHash, $language);
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Registration successful'];
        } else {
            return ['success' => false, 'message' => 'Registration failed'];
        }
    }
    
    // Login user
    public function login($email, $password) {
        $email = strtolower(trim($email));
        
        // Validate input
        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'Email and password are required'];
        }
        
        // Get user
        $stmt = $this->conn->prepare("SELECT id, full_name, email, password_hash, language FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }
        
        $user = $result->fetch_assoc();
        
        // Verify password
        if (!password_verify($password, $user['password_hash'])) {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }
        
        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['language'] = $user['language'];
        
        return [
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'language' => $user['language']
            ]
        ];
    }
    
    // Logout user
    public function logout() {
        session_destroy();
        return ['success' => true, 'message' => 'Logout successful'];
    }
    
    // Check if user is logged in
    public static function isLoggedIn() {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
    
    // Get current user
    public static function getCurrentUser() {
        if (self::isLoggedIn()) {
            return [
                'id' => $_SESSION['user_id'],
                'email' => $_SESSION['user_email'],
                'name' => $_SESSION['user_name'],
                'language' => $_SESSION['language'] ?? 'en'
            ];
        }
        return null;
    }
}
?>