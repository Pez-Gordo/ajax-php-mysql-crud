<?php

    if(isset($_POST['key'])) {

        $conn = new mysqli('localhost', 'root', 'my*8-9+6POiusql', 'companydirectory');

        if($_POST['key'] == 'getExistingData') {
            //$start = $conn->real_escape_string($_POST['start']);
            //$limit = $conn->real_escape_string($_POST['limit']);

            $sql = $conn->query("SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, departmentID, department.name FROM personnel LEFT JOIN department ON personnel.departmentID = department.id");
            if ($sql->num_rows > 0) {
                $response = "";
                while($data = $sql->fetch_array()) {
                    $response .= '
                        <tr>
                            <td>'.$data["id"].'</td>
                            <td>'.$data["firstName"].'</td>
                            <td>'.$data["lastName"].'</td>
                            <td>'.$data["jobTitle"].'</td>
                            <td>'.$data["email"].'</td>
                            <td>'.$data["name"].'</td>
                            

                            <td>
                                <input type="button" value="Edit" class="btn btn-secondary">
                                <input type="button" value="View" class="btn btn-primary">
                                <input type="button" value="Delete" class="btn btn-danger">

                            </td>
                        </tr>
                    ';
                }
                exit($response);
            }
            else
                
                exit('reachedMax');
        }

        $name = $conn->real_escape_string($_POST['name']);
        $surname = $conn->real_escape_string($_POST['surname']);
        $jobTitle = $conn->real_escape_string($_POST['jobTitle']);
        $email = $conn->real_escape_string($_POST['email']);
        $department = $conn->real_escape_string($_POST['departmentID']);

        if($_POST['key'] == 'addNew') {
            $sql = $conn->query("SELECT id FROM personnel WHERE email = '$email'");
            if($sql->num_rows > 0)
                exit("Employee with this email already exist");
            else {
                $conn->query("INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES ('$name', '$surname', '$jobTitle', '$email', '$department')");
                exit('Employee has been inserted');
            }
        }

        if($_POST['key'] == 'buildDepartmentsSelect') {
            $sql = $conn->query("SELECT id, name FROM department ORDER BY name ASC");
            if($sql->num_rows > 0) {
                $response = "";
                while($data = $sql->fetch_array()) {
                    $response .= '<option value='.$data["id"].'>'.$data["name"].'</option>';
                }
                exit($response);
            }
            else
                exit('reachedMax2');
        }
    }


?>
