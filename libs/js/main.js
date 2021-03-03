$(document).ready(function() {
    $("#addNewEmployee").on('click', function() {
        buildDepartmentsSelect()
        $("#tableManager").modal('show')
    })
    getExistingData()
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
                $('tbody').append(response)
                
                
            }
            else {
                //for some reason this plugin is included in index.html but not working when it's called
                $(".table").DataTable()
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
    } else if(key == "update") {
        name = $('#employeeNameUpdate')
        surname = $('#employeeSurnameUpdate')
        jobTitle = $('#employeeJobTitleUpdate')
        email = $('#employeeEmailUpdate')
        department = $('#departmentSelectUpdate')
        editRowID = $("#editRowIDUpdate")
        //console.log(department)
    }
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

                alert(response)  
            }
        })
        //for some reason this function call is not working
        getExistingData()

    } else {
        alert("You must fill all data")
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
            //$("#editRowIDUpdate").val(rowID)
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
