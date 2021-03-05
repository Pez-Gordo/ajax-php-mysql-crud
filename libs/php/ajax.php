<?php

    if(isset($_POST['key'])) {
        
        // connection to database
        $conn = new mysqli('localhost', 'root', 'my*8-9+6POiusql', 'companydirectory');

        // Rendering HTML 

        // Employees Table

        if($_POST['key'] == 'getExistingData') {
            
            $sql = $conn->query("SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.dname FROM personnel LEFT JOIN department ON personnel.departmentID = department.id ORDER BY lastName ASC");
            if ($sql->num_rows > 0) {
                $response = "";
                
                while($data = $sql->fetch_array()) {
                    
                            $response .= '
                                <tr>
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["firstName"].'</td>
                                    <td id="surname_'.$data["id"].'">'.$data["lastName"].'</td>
                                    <td>'.$data["jobTitle"].'</td>
                                    <td>'.$data["email"].'</td>
                                    <td>'.$data["dname"].'</td>
                                    <td>
                                        <button class="btn" onclick="readData('.$data["id"].')"><img src="./libs/img/eye.png" alt=""></button>
                                        <button class="btn" onclick="edit('.$data["id"].')"><img src="./libs/img/pencil.png" alt=""></button>
                                        <button class="btn" onclick="showModalDelete('.$data["id"].')"><img src="./libs/img/trash.png" alt=""></button>
                        
                                    </td>
                                </tr>
                            ';
                    
                }
                exit($response);
            }
            else
                
                exit('reachedMax');
        }

        // Departments Table

        if ($_POST['key'] == 'getExistingDataDep') {
            $sql = $conn->query("SELECT department.id, department.dname, department.locationID, location.lname FROM department LEFT JOIN location ON department.locationID = location.id ORDER BY department.dname ASC");
            if ($sql->num_rows > 0) {
                $response = "";
                
                while($data = $sql->fetch_array()) {
                    
                            $response .= '
                                <tr>
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["dname"].'</td>
                                    <td>'.$data["lname"].'</td>
                                    <td>
                                        <button class="btn" onclick="showModalDeleteDep('.$data["id"].')"><img src="./libs/img/trash.png" alt=""></button>
                                    </td>
                                </tr>
                            ';
                    
                }
                exit($response);
            }
            else
                
                exit('reachedMax');
            
        }

        // Locations Table

        if ($_POST['key'] == 'getExistingDataLoc') {
            $sql = $conn->query("SELECT location.id, location.lname FROM location ORDER BY location.lname ASC");
            if ($sql->num_rows > 0) {
                $response = "";
                
                while($data = $sql->fetch_array()) {
                    
                            $response .= '
                                <tr>
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["lname"].'</td>                                    
                                    <td>
                                        <button class="btn" onclick="showModalDeleteLoc('.$data["id"].')"><img src="./libs/img/trash.png" alt=""></button>
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
        $department = $conn->real_escape_string($_POST['department']);
        $location = $conn->real_escape_string($_POST['location']);

        if($_POST['key'] == 'addNew') {
            $sql = $conn->query("SELECT id FROM personnel WHERE email = '$email'");
            if($sql->num_rows > 0)
                exit("Employee with this email already exist");
            else {
                $conn->query("INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES ('$name', '$surname', '$jobTitle', '$email', '$department')");
                exit('Employee has been inserted');
            }
        }

        if($_POST['key'] == 'addNewDep') {
            
            $conn->query("INSERT INTO department (name, locationID) VALUES ('$name', '$location')");
            exit('New department has been inserted');
            
        }

        if($_POST['key'] == 'addNewLoc') {
            
            $conn->query("INSERT INTO location (name) VALUES ('$name')");
            exit('New location has been inserted');
            
        }

        if ($_POST['key'] == 'getRowData') {
            $rowID = $conn->real_escape_string($_POST['rowID']);
            $sql = $conn->query("SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.name FROM personnel LEFT JOIN department ON personnel.departmentID = department.id WHERE personnel.id='$rowID'");
            $data = $sql->fetch_array();
            $jsonArray = array(
                'employeeName' => $data['firstName'],
                'employeeSurname' => $data['lastName'],
                'employeeJobTitle' => $data['jobTitle'],
                'employeeEmail' => $data['email'],
                'departmentSelect' => $data['name'],
            );
            exit(json_encode($jsonArray));
        }

        if ($_POST['key'] == 'update') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));

            $conn->query("UPDATE personnel SET personnel.firstName = '$name', personnel.lastName = '$surname', personnel.jobTitle = '$jobTitle', personnel.email = '$email', personnel.departmentID = '$department' WHERE personnel.id = '$rowID'");
                exit;
            
                
        }
        
        if ($_POST['key'] == 'delete') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));

            $conn->query("DELETE FROM personnel WHERE personnel.id = '$rowID'");
                    
        }

        if ($_POST['key'] == 'deleteDep') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));
            $isDepEmpty = $conn->query("SELECT * FROM personnel WHERE personnel.departmentID = '$rowID'");
            if($isDepEmpty->num_rows > 0) {
                exit("Department must be empty to be deleted");
            }
            else{
                $conn->query("DELETE FROM department WHERE department.id = '$rowID'");
                exit;
            }
        }

        if ($_POST['key'] == 'deleteLoc') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));
            $isLocEmpty = $conn->query("SELECT * FROM department WHERE department.locationID = '$rowID'");
            if($isLocEmpty->num_rows > 0){
                exit("Location must be free of Departments to be deleted");
            }
            else{
                $conn->query("DELETE FROM location WHERE location.id = '$rowID'");
                exit;
            }
        }

        if ($_POST['key'] == 'buildDepartmentsSelect') {
            $sql = $conn->query("SELECT id, name FROM department ORDER BY name ASC");
            if($sql->num_rows > 0) {
                $response = "<option selected value='DEFAULT'>Select Department</option>";
                while($data = $sql->fetch_array()) {
                    $response .= '<option value='.$data["id"].'>'.$data["name"].'</option>';
                }
                exit($response);
            }
            else
                exit('reachedMax2');
        }

        if ($_POST['key'] == 'buildLocationsSelect') {
            $sql = $conn->query("SELECT location.id, location.name FROM location ORDER BY location.name ASC");
            if($sql->num_rows > 0) {
                $response = "<option selected value='DEFAULT'>Select Location</option>";
                while($data = $sql->fetch_array()) {
                    $response .= '<option value='.$data["id"].'>'.$data["name"].'</option>';
                }
                exit($response);
            }
            else
                exit('reachedMax3');
        }

    }        


?>
