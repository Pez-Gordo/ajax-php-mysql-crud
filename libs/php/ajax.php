<?php

    if(isset($_POST['key'])) {

        $conn = new mysqli('localhost', 'root', 'my*8-9+6POiusql', 'companydirectory');

        if($_POST['key'] == 'getExistingData') {
            
            $sql = $conn->query("SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.name FROM personnel LEFT JOIN department ON personnel.departmentID = department.id ORDER BY lastName ASC");
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
                                    <td>'.$data["name"].'</td>
                                    <td>
                                        <input type="button" onclick="readData('.$data["id"].')" value="Read" class="btn btn-primary">
                                        <input type="button" onclick="edit('.$data["id"].')" value="Update" class="btn btn-secondary">
                                        <input type="button" onclick="showModalDelete('.$data["id"].')" value="Delete" class="btn btn-danger">
                                    </td>
                                </tr>
                            ';
                    
                }
                exit($response);
            }
            else
                
                exit('reachedMax');
        }

        if ($_POST['key'] == 'getExistingDataDep') {
            $sql = $conn->query("SELECT department.id, department.name, department.locationID FROM department ORDER BY department.name ASC");
            if ($sql->num_rows > 0) {
                $response = "";
                
                while($data = $sql->fetch_array()) {
                    
                            $response .= '
                                <tr>
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["name"].'</td>
                                    <td>'.$data["locationID"].'</td>
                                    <td>
                                        <input type="button" onclick="showModalDeleteDep('.$data["id"].')" value="Delete" class="btn btn-danger">
                                    </td>
                                </tr>
                            ';
                    
                }
                exit($response);
            }
            else
                
                exit('reachedMax');
            
        }

        if ($_POST['key'] == 'getExistingDataLoc') {
            $sql = $conn->query("SELECT location.id, location.name FROM location ORDER BY location.name ASC");
            if ($sql->num_rows > 0) {
                $response = "";
                
                while($data = $sql->fetch_array()) {
                    
                            $response .= '
                                <tr>
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["name"].'</td>                                    
                                    <td>
                                        
                                        <input type="button" onclick="showModalDeleteLoc('.$data["id"].')" value="Delete" class="btn btn-danger">
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
        //$location = $conn->real_escape_string($_POST['location'])

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
                    exit;
                
                    
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
            $sql = $conn->query("SELECT location.id, name FROM companydirectory.location ORDER BY location.name ASC");
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
