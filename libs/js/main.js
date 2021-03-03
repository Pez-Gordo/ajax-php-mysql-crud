$(document).ready(function() {
    $("#addNewEmployee").on('click', function() {
        buildDepartmentsSelect()
        $("#tableManager").modal('show')
    })
    getExistingData()
    getExistingDataDep()
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

function manageData(key) {
    var name;
    var surname;
    var jobTitle;
    var email;
    var department;
    var editRowID;
    if(key == "addNew"){
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

        $.ajax({
            url: './libs/php/ajax.php',
            method: 'POST',
            dataType: 'text',
            data: {
                key: key,
                rowID: editRowID.val()
            },
            success: function (response) {

                alert(response)  
                getExistingData()
            }
        })
        
    }
    if(key != "delete"){
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
                    closeModalDelete()
                    $('#responseOpSuc').innerText = response
                    $("#tableManagerOpSucc").modal('show')
                    //alert(response)  
                    getExistingData()
                }
            })
            //for some reason this function call is not working
            //getExistingData()

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

}

function closeModalRead() {
    $("#tableManagerRead").modal('hide')
}

function closeModalCreate() {
    $("#tableManager").modal('hide')
}

function closeModalUpdate() {
    $("#tableManagerUpdate").modal('hide')
    getExistingData()
}

function closeModalOpSucc() {
    $("#tableManagerOpSucc").modal('hide')
    
}

function showModalDelete(rowID) {
    $("#tableManagerDelete").modal('show')
    $("#editRowIDDelete").val(rowID)
}

function closeDeleteModal() {
    $("#tableManagerDelete").modal('hide')
}

function closeModalOpSucc() {
    $("tableManagerOpSucc").modal('hide')
}

function closeModalDelete() {
    $("tableManagerDelete").modal('hide')
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

// Radio Buttons controls

$('#tableDepartments').hide()
$('#tableLocations').hide()


document.getElementById("btnradio1").addEventListener("click", function() {
    $('#tableDepartments').hide()
    $('#tableLocations').hide()
    $('#motherTable').removeClass("col-md-3")
    $('#motherTable').removeClass("col-md-9")
    $('#motherTable').addClass("col-md-12")
    $('#tableEmployees').show()
    
  });

document.getElementById("btnradio2").addEventListener("click", function() {
  $('#tableEmployees').hide()
  $('#tableLocations').hide()
  $('#motherTable').removeClass("col-md-12")
  $('#motherTable').removeClass("col-md-3")
  $('#motherTable').addClass("col-md-9")
  $('#tableDepartments').show()

});

document.getElementById("btnradio3").addEventListener("click", function() {
    $('#tableEmployees').hide()
    $('#tableDepartments').hide()
    $('#motherTable').removeClass("col-md-12")
    $('#motherTable').removeClass("col-md-9")
    $('#motherTable').addClass("col-md-3")
    $('#tableLocations').show()
  });
