<?php

    if(isset($_POST['key'])) {
        
        // connection to database
        $conn = new mysqli('localhost', 'root', 'my*8-9+6POiusql', 'companydirectory');

        // Employees Table

        if($_POST['key'] == 'getExistingData') {
            
            $sql = $conn->query("SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.dname FROM personnel LEFT JOIN department ON personnel.departmentID = department.id ORDER BY lastName ASC");
            if ($sql->num_rows > 0) {
                $rawData = array();
                $i = 0;
                while($data = $sql->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
            }
            else
                exit('reachedMax');   
        }

        // Departments Table

        if ($_POST['key'] == 'getExistingDataDep') {
            $sql = $conn->query("SELECT department.id, department.dname, department.locationID, location.lname FROM department LEFT JOIN location ON department.locationID = location.id ORDER BY department.dname ASC");
            if ($sql->num_rows > 0) {
                $rawData = array();
                $i = 0;
                while($data = $sql->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
            }
            else
                exit('reachedMax');                           
                    
        }

        // Locations Table

        if ($_POST['key'] == 'getExistingDataLoc') {
            $sql = $conn->query("SELECT location.id, location.lname FROM location ORDER BY location.lname ASC");
            
            if ($sql->num_rows > 0) {                
                $rawData = array();
                $i = 0;
                while($data = $sql->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
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

        // create employee

        if($_POST['key'] == 'addNew') {
            $email = $_POST['email'];
            $sql = $conn->query("SELECT id FROM personnel WHERE email = '$email'");
            if($sql->num_rows > 0)
                exit(1);
            else {
                $conn->query("INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES ('$name', '$surname', '$jobTitle', '$email', '$department')");
                exit('Employee has been inserted');
            }
        }

        // create new department

        if($_POST['key'] == 'addNewDep') {
            
            $conn->query("INSERT INTO department (dname, locationID) VALUES ('$name', '$location')");
            exit('New department has been inserted');
        }

        // create new location

        if($_POST['key'] == 'addNewLoc') {
            
            $conn->query("INSERT INTO location (lname) VALUES ('$name')");
            exit('New location has been inserted');
        }

        // get row data for read modal and update modal

        if ($_POST['key'] == 'getRowData') {
            $rowID = $conn->real_escape_string($_POST['rowID']);
            $sql = $conn->query("SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.dname FROM personnel LEFT JOIN department ON personnel.departmentID = department.id WHERE personnel.id='$rowID'");
            $data = $sql->fetch_array();
            $jsonArray = array(
                'employeeName' => $data['firstName'],
                'employeeSurname' => $data['lastName'],
                'employeeJobTitle' => $data['jobTitle'],
                'employeeEmail' => $data['email'],
                'departmentSelect' => $data['dname'],
                'departmentID' => $data['departmentID'],
            );
            exit(json_encode($jsonArray));
        }

        // update employee

        if ($_POST['key'] == 'update') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));
            
            $conn->query("UPDATE personnel SET personnel.firstName = '$name', personnel.lastName = '$surname', personnel.jobTitle = '$jobTitle', personnel.email = '$email', personnel.departmentID = '$department' WHERE personnel.id = '$rowID'");
            
            exit;
        }

        // checking email for database consistency

        if ($_POST['key'] == 'check') {
            $email = $_POST['emaile'];
            $result = $conn->query("SELECT * FROM personnel WHERE email LIKE '$email'");
            $rawData = array();
                $i = 0;
                while($data = $result->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
        }

        // checking email for database consistency

        if ($_POST['key'] == 'checkLoc') {
            $depName = $_POST['depName'];
            $location = $_POST['locID'];
            $result = $conn->query("SELECT * FROM department WHERE dname LIKE '$depName' AND locationID LIKE '$location'");
            $rawData = array();
                $i = 0;
                while($data = $result->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
        }

        if ($_POST['key'] == 'checkDelDep') {
            $rowID = $_POST['rowID'];
            $result = $conn->query("SELECT * FROM personnel WHERE departmentID = '$rowID'");
            $rawData = array();
                $i = 0;
                while($data = $result->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
        }

        if ($_POST['key'] == 'checkDelLoc') {
            $rowID = $_POST['rowID'];
            $result = $conn->query("SELECT * FROM department WHERE locationID = '$rowID'");
            $rawData = array();
                $i = 0;
                while($data = $result->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
        }            



        // delete employee
        
        if ($_POST['key'] == 'delete') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));

            $conn->query("DELETE FROM personnel WHERE personnel.id = '$rowID'");  
                exit;   
        }

        // delete department

        if ($_POST['key'] == 'deleteDep') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));
            $conn->query("DELETE FROM department WHERE department.id = '$rowID'");
            exit;
            /*
            $isDepEmpty = $conn->query("SELECT * FROM personnel WHERE departmentID = '$rowID");
            if($isDepEmpty->num_rows > 0){
                exit("Fail");
            }
            else{
                $conn->query("DELETE FROM department WHERE department.id = '$rowID'");
                exit;
            }*/
        }

        // delete location

        if ($_POST['key'] == 'deleteLoc') {
            $rowID = intval($conn->real_escape_string($_POST['rowID']));
            $conn->query("DELETE FROM location WHERE location.id = '$rowID'");
            exit;
            /*
            $isLocEmpty = $conn->query("SELECT * FROM department WHERE locationID = '$rowID");
            if($isLocEmpty->num_rows > 0){
                exit("Fail");
            }
            else{
                $conn->query("DELETE FROM location WHERE location.id = '$rowID'");
                exit;
            }*/
        }

        // build departments select

        if ($_POST['key'] == 'buildDepartmentsSelect') {
            $sql = $conn->query("SELECT id, dname FROM department ORDER BY dname ASC");
            if($sql->num_rows > 0) {
                $rawData = array();
                $i = 0;
                while($data = $sql->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
            }
            else
                exit('reachedMax');
        }

        // build locations select

        if ($_POST['key'] == 'buildLocationsSelect') {
            $sql = $conn->query("SELECT location.id, location.lname FROM location ORDER BY location.lname ASC");
            if($sql->num_rows > 0) {
                $rawData = array();
                $i = 0;
                while($data = $sql->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
            }
            else
                exit('reachedMax');
        }

        // // implementing search input

        if($_POST['key'] == 'querySearch') {
            
            $query = $_POST['query'];
            
            $sql = $conn->query($query);
            
            if($sql->num_rows > 0) {
                $rawData = array();
                $i = 0;
                while($data = $sql->fetch_array()) {
                    $rawData[$i] = $data;
                    $i++;    
                }
                exit(json_encode($rawData));
            }
            else
                exit(json_encode($sql));
        }
    }        
?>
