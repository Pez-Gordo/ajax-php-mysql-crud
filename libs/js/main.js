//var eTable = $('#tableEmployees')
//var dTable = $('#tableDepartments')
//var lTable = $('#tableLocations')

var activeButton = "employees"


$(document).ready(function() {
    $("#addNewEmployee").on('click', function() {
        buildDepartmentsSelect()
        $("#tableManager").modal('show')
    })
    $("#addNewDepartment").on('click', function() {
        buildLocationsSelect()
        $("#tableManagerDepartment").modal('show')
    })
    $("#addNewLocation").on('click', function() {
        $("#tableManagerLocation").modal('show')
    })

    getExistingData()
    getExistingDataDep()
    getExistingDataLoc()

    
    //eTable.dataTable()
})


function edit(rowID) {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getRowData',
            rowID: rowID
        },
        success: function (response) {
            $("#editRowIDUpdate").val(rowID)
            $("#employeeNameUpdate").val(response.employeeName)
            $("#employeeSurnameUpdate").val(response.employeeSurname)
            $("#employeeJobTitleUpdate").val(response.employeeJobTitle)
            $("#employeeEmailUpdate").val(response.employeeEmail)
            buildDepartmentsSelect()
            $("#departmentSelectUpdate").val(response.departmentSelect)
            showModalUpdate()
            //$("#tableManagerUpdate").modal('show')
            console.log(response.departmentSelect)
        }

    })
}


function getExistingData() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getExistingData',
        },
        success: function(response) {
            console.log(response)
            if(response != "reachedMax") {
                $('#tbodyEmployees').empty()
                var rows = ""
                
                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td><td>" + response[i][2] + "</td><td>" + response[i][3] + "</td><td>" + response[i][4] + "</td><td>" + response[i][6] + "</td>"
                    rows += "<td><img src='./libs/img/eye.png' onclick='readData(" + response[i][0] + ")'>"
                    rows += "<img src='./libs/img/pencil.png' onclick='edit(" + response[i][0] + ")'>"
                    rows += "<img src='./libs/img/trash.png' onclick='showModalDeleteLoc(" + response[i][0] + ")'></td></tr>"
                }
                $('#tbodyEmployees').append(rows)   
            }
        }

    })
}

/*
                                <tr>                                    
                                    <td>'.$data["firstName"].'</td>
                                    <td id="surname_'.$data["id"].'">'.$data["lastName"].'</td>
                                    <td class="one">'.$data["jobTitle"].'</td>
                                    <td class="one">'.$data["email"].'</td>
                                    <td class="two">'.$data["dname"].'</td>
                                    <td>
                                        <div class="containerTD">
                                            <div class="left">
                                                <img class="inlineImage" src="./libs/img/eye.png" alt="" onclick="readData('.$data["id"].')">
                                            </div>
                                            <div class="center">
                                                <img class="inlineImage" src="./libs/img/pencil.png" alt="" onclick="edit('.$data["id"].')">
                                            </div>
                                            <div class="right">
                                                <img class="inlineImage" src="./libs/img/trash.png" alt="" onclick="showModalDelete('.$data["id"].')">
                                            </div>                                        
                                        </div>
                                    </td>
                                </tr>
*/

function getExistingDataDep() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getExistingDataDep',
        },
        success: function(response) {
            console.log(response)
            if(response != "reachedMax") {
                $('#tbodyDepartments').empty()
                var rows = ""
                
                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td><td>" + response[i][3] + "</td>"
                    rows += "<td><img src='./libs/img/trash.png' onclick='showModalDeleteLoc(" + response[i][0] + ")'></td></tr>"
                }
                $('#tbodyDepartments').append(rows)   
            }
        }

    })
}
/*
                                <tr>
                                    <td>'.$data["dname"].'</td>
                                    <td>'.$data["lname"].'</td>
                                    <td>
                                       <img src="./libs/img/trash.png" alt="" onclick="showModalDeleteDep('.$data["id"].')">
                                    </td>
                                </tr>
*/
function getExistingDataLoc() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getExistingDataLoc',
        },
        success: function(response) {
            
            console.log(response)
            if(response != "reachedMax") {
                $('#tbodyLocations').empty()
                var rows = ""
                
                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td>"
                    rows += "<td><img src='./libs/img/trash.png' onclick='showModalDeleteLoc(" + response[i][0] + ")'></td></tr>"
                }
                $('#tbodyLocations').append(rows)   
            }
        }

    })
}



function manageData(key) {
    var name;
    var surname;
    var jobTitle;
    var email;
    var department;
    var editRowID;
    var location;
    if(key == "addNewLoc") {
        name = $("#locationName")
        
        editRowIDLoc = $('#editRowIDLocation')
        //closeModalCreateDep()
        if(isNotEmpty(name)) {
            $.ajax({
                url: './libs/php/ajax.php',
                method: 'POST',
                dataType: 'text',
                data: {
                    key: key,
                    name: name.val(),
                    rowID: editRowIDLoc.val()
                },
                success: function (response) {
                    closeModalCreateLoc()
                    $('#responseOpSuc').innerText = response
                    showModalOpSucc() 
                    //$("#tableManagerOpSucc").modal('show')
                    //alert(response)  
                    getExistingDataLoc()
                }
            })
        }
    
    }  else if(key == "addNewDep") {
        name = $("#departmentName")
        location = $('#locationSelect')
        editRowIDDep = $('#editRowIDDepartment')
        //closeModalCreateDep()
        if(isNotEmpty(name) && location.val() !== "DEFAULT") {
            $.ajax({
                url: './libs/php/ajax.php',
                method: 'POST',
                dataType: 'text',
                data: {
                    key: key,
                    name: name.val(),
                    location: location.val(),
                    rowID: editRowIDDep.val()
                },
                success: function (response) {
                    closeModalCreateDep()
                    $('#responseOpSuc').innerText = response
                    showModalOpSucc() 
                    //$("#tableManagerOpSucc").modal('show')
                    //alert(response)  
                    getExistingDataDep()
                }
            })
        }

    } else if(key == "addNew"){
        name = $('#employeeName')
        surname = $('#employeeSurname')
        jobTitle = $('#employeeJobTitle')
        email = $('#employeeEmail')
        department = $('#departmentSelect')
        editRowID = $("#editRowID")
        closeModalCreate()
        

    } else if(key == "update") {
        name = $('#employeeNameUpdate')
        surname = $('#employeeSurnameUpdate')
        jobTitle = $('#employeeJobTitleUpdate')
        email = $('#employeeEmailUpdate')
        department = $('#departmentSelectUpdate')
        editRowID = $("#editRowIDUpdate")
        //console.log(department)
        closeModalUpdate()
        

    } else if(key == "delete") {
        editRowID = $("#editRowIDDelete")
        closeModalDelete()
        $.ajax({
            url: './libs/php/ajax.php',
            method: 'POST',
            dataType: 'text',
            data: {
                key: key,
                rowID: editRowID.val()
            },
            success: function (response) {
                showModalOpSucc()
                //alert(response)  
                getExistingData()
            }
        })
    } else if(key == "deleteDep") {
        editRowID = $("#editRowIDDeleteDep")
        closeModalDelete()

        $.ajax({
            url: './libs/php/ajax.php',
            method: 'POST',
            dataType: 'text',
            data: {
                key: key,
                rowID: editRowID.val()
            },
            success: function (response) {
                if(response === "Department must be empty to be deleted") {
                    showModalOpFail()
                }
                else {
                    showModalOpSucc()
                    getExistingDataDep()

                }  
            }
        })
    } else if(key == "deleteLoc") {
        editRowID = $("#editRowIDDeleteLoc")
        closeModalDelete()

        $.ajax({
            url: './libs/php/ajax.php',
            method: 'POST',
            dataType: 'text',
            data: {
                key: key,
                rowID: editRowID.val()
            },
            success: function (response) {
                if(response === "Location must be free of Departments to be deleted") {
                    showModalOpFail()
                }
                else {
                    showModalOpSucc()
                    getExistingDataLoc()

                }  
            }
        })
    }

    if(key != "delete" && key != "addNewDep" && key != "addNewLoc" && key != "deleteDep" && key != "deleteLoc"){
        if (isNotEmpty(name) && isNotEmpty(surname) && isNotEmpty(jobTitle) && isNotEmpty(email) && department.val() !== "DEFAULT") {
            console.log(department.val())
            $.ajax({
                url: './libs/php/ajax.php',
                method: 'POST',
                dataType: 'text',
                data: {
                    key: key,
                    name: name.val(),
                    surname: surname.val(),
                    jobTitle: jobTitle.val(),
                    email: email.val(),
                    department: department.val(),
                    rowID: editRowID.val()
                },
                success: function (response) {
                    
                    //$('#responseOpSuc').innerText = response
                    showModalOpSucc() 
                    getExistingData()
                    
                }
            })
        } else {
            
            showModalOpFailFill()

        }
    } 
}   

function isNotEmpty(caller) {
    if (caller.val() == '') {
        caller.css('border', '1px solid red')
        return false
    }
    else {
        caller.css('border', '')
    }
    return true
}

function buildDepartmentsSelect() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'text',
        data: {
            key: 'buildDepartmentsSelect',
        },
        success: function(response) {
            if(response != "reachedMax2") {
                    $('#departmentSelect').append(response)
                    $('#departmentSelectUpdate').append(response)
                }
        }
    })
}

function buildLocationsSelect() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'text',
        data: {
            key: 'buildLocationsSelect',
        },
        success: function(response) {
            if(response != "reachedMax3") {
                //$('#locationSelect').append("<option selected value='DEFAULT'>Select Department</option>")

                    $('#locationSelect').append(response)
                    //$('#locationsSelectUpdate').append(response)
                }
        }
    })
}


// Modal Management Functions

function closeModalRead() {
    $("#tableManagerRead").modal('hide')
}

function showModalRead() {
    $("#tableManagerRead").modal('show')
}

function closeModalCreate() {
    $("#tableManager").modal('hide')
}

function closeModalCreateDep() {
    $("#tableManagerDepartment").modal('hide')
    getExistingDataDep()
}

function closeModalCreateLoc() {
    $("#tableManagerLocation").modal('hide')
    getExistingDataLoc()
}


function closeModalUpdate() {
    $("#tableManagerUpdate").modal('hide')
    getExistingData()
}

function closeModalOpSucc() {
    $("#tableManagerOpSucc").modal('hide')
}

function showModalOpSucc() {
    $("#tableManagerOpSucc").modal('show')
}

function showModalOpFail() {
    $("#tableManagerOpFail").modal("show")
}

function closeModalOpFail() {
    $("#tableManagerOpFail").modal("hide")
}

function showModalOpFailFill() {
    $("#tableManagerOpFailFill").modal("show")
}

function closeModalOpFailFill() {
    $("#tableManagerOpFailFill").modal("hide")
}


function showModalUpdate() {
    $("#tableManagerUpdate").modal('show')
}

function showModalDelete(rowID) {
    $("#tableManagerDelete").modal('show')
    $("#editRowIDDelete").val(rowID) 
    $("#editRowIDDeleteDep").val(rowID)
    $("#editRowIDDeleteLoc").val(rowID)

}

function showModalDeleteDep(rowID) {
    $("#tableManagerDeleteDep").modal('show')
    $("#editRowIDDelete").val(rowID) 
    $("#editRowIDDeleteDep").val(rowID)
    $("#editRowIDDeleteLoc").val(rowID)
}

function showModalDeleteLoc(rowID) {
    $("#tableManagerDeleteLoc").modal('show')
    $("#editRowIDDelete").val(rowID) 
    $("#editRowIDDeleteDep").val(rowID)
    $("#editRowIDDeleteLoc").val(rowID)
}

function closeModalDelete() {
    $("#tableManagerDelete").modal('hide')
    $("#tableManagerDeleteDep").modal('hide')
    $("#tableManagerDeleteLoc").modal('hide')
}




function readData(rowID) {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getRowData',
            rowID: rowID
        },
        success: function (response) {
        
            $("#employeeNameRead").val(response.employeeName)
            $("#employeeSurnameRead").val(response.employeeSurname)
            $("#employeeJobTitleRead").val(response.employeeJobTitle)
            $("#employeeEmailRead").val(response.employeeEmail)
            $("#departmentSelectRead").val(response.departmentSelect)
            
            showModalRead()
            //$("#tableManagerRead").modal('show')
            //console.log(response.departmentSelect)
        }

    })
    
}

/*
function deleteData(rowID) {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'deleteRowData',
            rowID: rowID
        },
        success: function (response) {
            console.log(response)
            //$("#editRowIDDelete").val(rowID)
            alert("employee has been deleted")
            $("#tableManagerDelete").modal('show')
            //console.log(response.departmentSelect)
        }

    })
    
}
*/

// Bootstrap Radio Button controls to toggle between different tables

$('#tableDepartments').hide()
$('#tableLocations').hide()
$('#addNewDepartment').hide()
$('#addNewLocation').hide()



document.getElementById("btnradio1").addEventListener("click", function() {
    $('#tableDepartments').hide()
    $('#tableLocations').hide()
    /*
    $('#motherTable').removeClass("col-md-8 col-md-offset-6")
    $('#motherTable').removeClass("col-md-10 col-md-offset-4")
    $('#motherTable').addClass("col-md-12 col-md-offset-2")
    */
    $('#tableEmployees').show()
    $('#addNewDepartment').hide()
    $('#addNewLocation').hide()
    $('#addNewEmployee').show()

    $("#employeesImg").attr("src", "./libs/img/employeesSel.png")
    $("#departmentsImg").attr("src", "./libs/img/departments.png")
    $("#locationsImg").attr("src", "./libs/img/locations.png")
    
    activeButton = "employees"

    //dTable.fnDestroy();
    //lTable.fnDestroy();
    //oTable.dataTable();
  });

document.getElementById("btnradio2").addEventListener("click", function() {
  $('#tableEmployees').hide()
  $('#tableLocations').hide()
  /*
  $('#motherTable').removeClass("col-md-12 col-md-offset-2")
  $('#motherTable').removeClass("col-md-8 col-md-offset-6")
  $('#motherTable').addClass("col-md-10 col-md-offset-4")
  */
  $('#tableDepartments').show()
  $('#addNewDepartment').show()
  $('#addNewLocation').hide()
  $('#addNewEmployee').hide()

    $("#employeesImg").attr("src", "./libs/img/employees.png")
    $("#departmentsImg").attr("src", "./libs/img/departmentsSel.png")
    $("#locationsImg").attr("src", "./libs/img/locations.png")

    activeButton = "departments"

  //oTable.fnDestroy();
  //lTable.fnDestroy();
  //dTable.dataTable();
});

document.getElementById("btnradio3").addEventListener("click", function() {
    $('#tableEmployees').hide()
    $('#tableDepartments').hide()
    /*
    $('#motherTable').removeClass("col-md-12 col-md-offset-2")
    $('#motherTable').removeClass("col-md-10 col-md-offset-4")
    $('#motherTable').addClass("col-md-8 col-md-offset-6")
    */
    $('#tableLocations').show()
    $('#addNewDepartment').hide()
    $('#addNewLocation').show()
    $('#addNewEmployee').hide()

    $("#employeesImg").attr("src", "./libs/img/employees.png")
    $("#departmentsImg").attr("src", "./libs/img/departments.png")
    $("#locationsImg").attr("src", "./libs/img/locationsSel.png")

    activeButton = "locations"

    //oTable.fnDestroy();
    //dTable.fnDestroy();
    //lTable.dataTable();
});


function onHover(param)
{   
    if(param === "employees") {
        $("#employeesImg").attr('src', './libs/img/employeesSel.png')
    }
    else if(param === "departments") {
        $("#departmentsImg").attr('src', './libs/img/departmentsSel.png')
    }
    else if(param === "locations"){
        $("#locationsImg").attr('src', './libs/img/locationsSel.png')
    }

}

function offHover(param)
{

    if(param === "employees") {
        if(activeButton === "employees") {
            $("#employeesImg").attr('src', './libs/img/employeesSel.png')
        } 
        else {
            $("#employeesImg").attr('src', './libs/img/employees.png');
        }
    }
    else if(param === "departments") {
        if(activeButton === "departments"){
            $("#departmentsImg").attr('src', './libs/img/departmentsSel.png')
        }
        else {
            $("#departmentsImg").attr('src', './libs/img/departments.png');
        }
    }
    else if(param === "locations"){
        if(activeButton === "locations"){
            $("#locationsImg").attr('src', './libs/img/locationsSel.png')
        }
        else {
            $("#locationsImg").attr('src', './libs/img/locations.png');
        }
    }
}