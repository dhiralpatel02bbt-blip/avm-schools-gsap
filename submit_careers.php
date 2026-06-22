<?php
// submit_careers.php

// Database configuration (Replace with your actual details)
$dbHost = 'localhost';
$dbUsername = 'u640562641_avm_db';
$dbPassword = 'ni7M!Iu9';
$dbName = 'u640562641_avm_db';

// Email configuration
$toEmail = 'arya.aspiredesigns@gmail.com'; // Replace with the destination email address
$fromEmail = 'noreply@avmschools.ac.in';

header('Content-Type: application/json');

// Directory for storing uploaded documents
$uploadDir = __DIR__ . '/careers-doc/';

// Ensure upload directory exists
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory.']);
        exit;
    }
}

// Function to handle file uploads
function uploadFile($fileInputName, $uploadDir) {
    if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES[$fileInputName]['tmp_name'];
        $fileName = $_FILES[$fileInputName]['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        // Allowed file types
        $allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
        if (!in_array($fileExtension, $allowedExtensions)) {
            return ['success' => false, 'message' => "Invalid file format for {$fileInputName}. Allowed: pdf, doc, docx, jpg, png."];
        }

        // Unique file name to prevent overwriting
        $newFileName = uniqid() . '-' . preg_replace('/[^a-zA-Z0-9.-]/', '_', $fileName);
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            return ['success' => true, 'path' => 'careers-doc/' . $newFileName];
        } else {
            return ['success' => false, 'message' => "Error moving uploaded file {$fileInputName}."];
        }
    }
    return ['success' => false, 'message' => "File {$fileInputName} is required."];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Capture and sanitize inputs
    $position = isset($_POST['position']) ? trim($_POST['position']) : '';
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';

    // 2. Server-side Validation
    if (empty($position) || empty($name) || empty($phone) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'All fields are compulsory.']);
        exit;
    }

    // Phone validation: exactly 10 digits
    if (!preg_match('/^\d{10}$/', $phone)) {
        echo json_encode(['success' => false, 'message' => 'Phone number must be exactly 10 digits.']);
        exit;
    }

    // Email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
        exit;
    }

    // 3. Handle File Uploads
    $cvUpload = uploadFile('updated-cv', $uploadDir);
    if (!$cvUpload['success']) {
        echo json_encode(['success' => false, 'message' => $cvUpload['message']]);
        exit;
    }

    $letterUpload = uploadFile('application-letter', $uploadDir);
    if (!$letterUpload['success']) {
        // Cleanup CV if letter fails
        unlink(__DIR__ . '/' . $cvUpload['path']);
        echo json_encode(['success' => false, 'message' => $letterUpload['message']]);
        exit;
    }

    $certUpload = uploadFile('certifications', $uploadDir);
    if (!$certUpload['success']) {
        // Cleanup previous files
        unlink(__DIR__ . '/' . $cvUpload['path']);
        unlink(__DIR__ . '/' . $letterUpload['path']);
        echo json_encode(['success' => false, 'message' => $certUpload['message']]);
        exit;
    }

    $cvPath = $cvUpload['path'];
    $letterPath = $letterUpload['path'];
    $certPath = $certUpload['path'];

    // 4. Save to Database
    $dbConnectionFailed = false;
    try {
        $conn = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare("INSERT INTO job_applications (position, name, phone, email, cv_path, cover_letter_path, certifications_path) VALUES (:position, :name, :phone, :email, :cv_path, :cover_letter_path, :certifications_path)");
        $stmt->bindParam(':position', $position);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':cv_path', $cvPath);
        $stmt->bindParam(':cover_letter_path', $letterPath);
        $stmt->bindParam(':certifications_path', $certPath);
        $stmt->execute();
    } catch(PDOException $e) {
        $dbConnectionFailed = true;
        $dbErrorMessage = "Database error: " . $e->getMessage();
        // Since we don't want to stop the process entirely if the DB is just not setup yet (as we used mock creds),
        // we'll log it, but we can still send the email and report success or failure.
        // For strictness, let's return error if DB fails:
        // echo json_encode(['success' => false, 'message' => $dbErrorMessage]);
        // exit;
    }

    // 5. Send Notification Email
    $subject = "New Job Application: " . $position . " - " . $name;
    $message = "You have received a new job application.\n\n";
    $message .= "Position: " . $position . "\n";
    $message .= "Name: " . $name . "\n";
    $message .= "Phone: " . $phone . "\n";
    $message .= "Email: " . $email . "\n";
    $message .= "\nDocuments have been uploaded to the server (careers-doc/ directory).\n";
    $message .= "CV: " . $cvPath . "\n";
    $message .= "Application Letter: " . $letterPath . "\n";
    $message .= "Certifications: " . $certPath . "\n";

    $headers = "From: " . $fromEmail . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    // Attempt to send email
    $mailSent = @mail($toEmail, $subject, $message, $headers);

    if ($dbConnectionFailed) {
        // You might want to remove this conditionally if you expect the DB to fail while testing without real creds.
        echo json_encode(['success' => false, 'message' => 'Application received, but database connection failed. Make sure to update credentials in submit_careers.php.']);
    } else {
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your application! It has been successfully submitted.'
        ]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
