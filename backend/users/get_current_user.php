<?php
// Start or resume the session
session_start();

// Set the content type to JSON
header('Content-Type: application/json');

// Prepare the response
$response = [
    'success' => false,
    'user' => null,
    'error' => null
];

// Check if the user is logged in
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    // User is logged in, return the user information
    $response['success'] = true;
    $response['user'] = [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username']
    ];
} else {
    // User is not logged in
    $response['error'] = 'User not logged in';
}

// Return the response as JSON
echo json_encode($response); 