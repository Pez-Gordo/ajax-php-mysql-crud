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
            
            $("#tableManagerUpdate").modal('show')
            console.log(response.departmentSelect)
        }

    })
}


function getExistingData() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'text',
        data: {
            key: 'getExistingData',
        },
        success: function(response) {
            if(response != "reachedMax") {
                $('#tbodyEmployees').empty()
                $('#tbodyEmployees').append(response)
                //$(".table").DataTable()
                
            }
            
        }

    })
}

function getExistingDataDep() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'text',
        data: {
            key: 'getExistingDataDep',
        },
        success: function(response) {
            if(response != "reachedMax") {
                $('#tbodyDepartments').empty()
                $('#tbodyDepartments').append(response)
                //$(".table").DataTable()
                
            }
            
        }

    })
}

function getExistingDataLoc() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'text',
        data: {
            key: 'getExistingDataLoc',
        },
        success: function(response) {
            if(response != "reachedMax") {
                $('#tbodyLocations').empty()
                $('#tbodyLocations').append(response)
                //$(".table").DataTable()
                
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
                showModalOpSucc()
                //alert(response)  
                getExistingDataDep()
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
                showModalOpSucc()
                //alert(response)  
                
                getExistingDataLoc()
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
                    closeDeleteModal()
                    $('#responseOpSuc').innerText = response
                    showModalOpSucc() 
                    //$("#tableManagerOpSucc").modal('show')
                    //alert(response)  
                    getExistingData()
                }
            })
        } else {
            alert("You must fill all data")
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

function closeModalRead() {
    $("#tableManagerRead").modal('hide')
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
            
            $("#tableManagerRead").modal('show')
            //console.log(response.departmentSelect)
        }

    })
    
}


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

// Bootstrap Radio Button controls to toggle between different tables

$('#tableDepartments').hide()
$('#tableLocations').hide()
$('#addNewDepartment').hide()
$('#addNewLocation').hide()



document.getElementById("btnradio1").addEventListener("click", function() {
    $('#tableDepartments').hide()
    $('#tableLocations').hide()
    $('#motherTable').removeClass("col-md-6")
    $('#motherTable').removeClass("col-md-9")
    $('#motherTable').addClass("col-md-12")
    $('#tableEmployees').show()
    $('#addNewDepartment').hide()
    $('#addNewLocation').hide()
    $('#addNewEmployee').show()
  });

document.getElementById("btnradio2").addEventListener("click", function() {
  $('#tableEmployees').hide()
  $('#tableLocations').hide()
  $('#motherTable').removeClass("col-md-12")
  $('#motherTable').removeClass("col-md-6")
  $('#motherTable').addClass("col-md-9")
  $('#tableDepartments').show()
  $('#addNewDepartment').show()
  $('#addNewLocation').hide()
  $('#addNewEmployee').hide()
});

document.getElementById("btnradio3").addEventListener("click", function() {
    $('#tableEmployees').hide()
    $('#tableDepartments').hide()
    $('#motherTable').removeClass("col-md-12")
    $('#motherTable').removeClass("col-md-9")
    $('#motherTable').addClass("col-md-6")
    $('#tableLocations').show()
    $('#addNewDepartment').hide()
    $('#addNewLocation').show()
    $('#addNewEmployee').hide()
  });
