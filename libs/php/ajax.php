<?php

    if(isset($_POST['key'])) {

        $conn = new mysqli('localhost', 'root', 'my*8-9+6POiusql', 'companydirectory');
        $name = $conn->real_escape_string($_POST['name']);
        $surname = $conn->real_escape_string($_POST['surname']);
        $jobTitle = $conn->real_escape_string($_POST['jobTitle']);
        $email = $conn->real_escape_string($_POST['email']);
        //$department = $conn->real_escape_string($_POST['employeeDepartment']);

        if($_POST['key'] == 'addNew') {
            $sql = $conn->query("SELECT id FROM personnel WHERE email = '$email'");
            if($sql->num_rows > 0)
                exit("Employee with this email already exist");
            else {
                $conn->query("INSERT INTO personnel (firstName, lastName, jobTitle, email) VALUES ('$name', '$surname', '$jobTitle', '$email')");
                exit('Employee has been inserted');
            }
        }
    }


?>
