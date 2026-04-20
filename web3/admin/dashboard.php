<?php
require_once '../config.php';
require_once '../auth.php';

if (!UserAuth::isLoggedIn() || $_SESSION['user_id'] != 1) {
    header('Location: ../login.html');
    exit;
}

$user = UserAuth::getCurrentUser();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | RecipeRadar</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-card h3 {
            color: #666;
            margin-bottom: 10px;
        }
        
        .stat-card .number {
            font-size: 2.5em;
            color: #f59e0b;
            font-weight: bold;
        }
        
        .table-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th {
            background: #f9f9f9;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #ddd;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        
        tr:hover {
            background: #f9f9f9;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .btn-primary {
            background: #3498db;
            color: white;
        }
        
        .btn-danger {
            background: #e74c3c;
            color: white;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Admin Dashboard</h1>
            <div>
                <span>Welcome, <?php echo htmlspecialchars($user['name']); ?></span>
                <a href="../api/auth.php?action=logout" style="color: white; margin-left: 20px;">Logout</a>
            </div>
        </div>
        
        <div class="stats" id="stats">
            <div class="stat-card">
                <h3>Total Users</h3>
                <div class="number" id="total-users">0</div>
            </div>
            <div class="stat-card">
                <h3>Total Recipes</h3>
                <div class="number" id="total-recipes">0</div>
            </div>
            <div class="stat-card">
                <h3>Feedback</h3>
                <div class="number" id="total-feedback">0</div>
            </div>
        </div>
        
        <div class="table-section">
            <h2>Recent Feedback</h2>
            <table id="feedback-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Rating</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    
    <script>
        async function loadDashboard() {
            try {
                const response = await fetch('../api/feedback.php?action=get-feedback');
                const data = await response.json();
                
                if (data.success) {
                    const tbody = document.querySelector('#feedback-table tbody');
                    tbody.innerHTML = '';
                    
                    data.feedback.forEach(item => {
                        const row = `
                            <tr>
                                <td>${item.full_name}</td>
                                <td>${item.email}</td>
                                <td>${item.rating || 'N/A'}</td>
                                <td>${item.message || 'N/A'}</td>
                                <td>${new Date(item.created_at).toLocaleDateString()}</td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
                    });
                    
                    document.getElementById('total-feedback').textContent = data.feedback.length;
                }
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        }
        
        loadDashboard();
        setInterval(loadDashboard, 5000); // Refresh every 5 seconds
    </script>
</body>
</html>