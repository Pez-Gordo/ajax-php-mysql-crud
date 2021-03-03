<?php

    if(isset($_POST['key'])) {

        $conn = new mysqli('localhost', 'root', 'my*8-9+6POiusql', 'companydirectory');

       


        if($_POST['key'] == 'getExistingData') {
            
            $sql = $conn->query("SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.name FROM personnel LEFT JOIN department ON personnel.departmentID = department.id ORDER BY lastName ASC");
            if ($sql->num_rows > 0) {
                $response = "";
                $cont = 0;
                while($data = $sql->fetch_array()) {
                    switch($cont){
                        case 0:
                            $response .= '
                                <tr class="table-danger">
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["firstName"].'</td>
                                    <td id="surname_'.$data["id"].'">'.$data["lastName"].'</td>
                                    <td>'.$data["jobTitle"].'</td>
                                    <td>'.$data["email"].'</td>
                                    <td>'.$data["name"].'</td>
                                    <td>
                                        <input type="button" value="Read" class="btn btn-primary">
                                        <input type="button" onclick="edit('.$data["id"].')" value="Update" class="btn btn-secondary">
                                        <input type="button" value="Delete" class="btn btn-danger">
                                    </td>
                                </tr>
                            ';
                            $cont++;
                            break;
                        case 1:
                            $response .= '
                                <tr class="table-warning">
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["firstName"].'</td>
                                    <td id="surname_'.$data["id"].'">'.$data["lastName"].'</td>
                                    <td>'.$data["jobTitle"].'</td>
                                    <td>'.$data["email"].'</td>
                                    <td>'.$data["name"].'</td>
                                    <td>
                                        <input type="button" value="Read" class="btn btn-primary">
                                        <input type="button" onclick="edit('.$data["id"].')" value="Update" class="btn btn-secondary">
                                        <input type="button" value="Delete" class="btn btn-danger">
                                    </td>
                                </tr>
                            ';
                            $cont++;
                            break;
                        case 2:
                            $response .= '
                                <tr class="table-success">
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["firstName"].'</td>
                                    <td id="surname_'.$data["id"].'">'.$data["lastName"].'</td>
                                    <td>'.$data["jobTitle"].'</td>
                                    <td>'.$data["email"].'</td>
                                    <td>'.$data["name"].'</td>
                                    <td>
                                        <input type="button" value="Read" class="btn btn-primary">
                                        <input type="button" onclick="edit('.$data["id"].')" value="Update" class="btn btn-secondary">
                                        <input type="button" value="Delete" class="btn btn-danger">
                                    </td>
                                </tr>
                            ';
                            $cont++;
                            break;
                        case 3:
                            $response .= '
                                <tr class="table-light">
                                    <td>'.$data["id"].'</td>
                                    <td>'.$data["firstName"].'</td>
                                    <td id="surname_'.$data["id"].'">'.$data["lastName"].'</td>
                                    <td>'.$data["jobTitle"].'</td>
                                    <td>'.$data["email"].'</td>
                                    <td>'.$data["name"].'</td>
                                    <td>
                                        <input type="button" value="Read" class="btn btn-primary">
                                        <input type="button" onclick="edit('.$data["id"].')" value="Update" class="btn btn-secondary">
                                        <input type="button" value="Delete" class="btn btn-danger">
                                    </td>
                                </tr>
                            ';
                            $cont = 0;
                            break;
                    }
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
        

        if($_POST['key'] == 'addNew') {
            $sql = $conn->query("SELECT id FROM personnel WHERE email = '$email'");
            if($sql->num_rows > 0)
                exit("Employee with this email already exist");
            else {
                $conn->query("INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES ('$name', '$surname', '$jobTitle', '$email', '$department')");
                exit('Employee has been inserted');
            }
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
            $rowID = $conn->real_escape_string($_POST['rowID']);

            //$sql = $conn->query("SELECT id FROM personnel WHERE email = '$email'");
            $conn->query("UPDATE personnel SET firstName = '$name', lastName = '$surname', jobTitle = '$jobTitle', email = '$email', departmentID = '$department' WHERE id = '$rowId'");
                exit('Employee has been updated');
            

        if ($_POST['key'] == 'buildDepartmentsSelect') {
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
