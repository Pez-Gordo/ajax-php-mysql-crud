$(document).ready(function() {
    $("#addNew").on('click', function() {
        buildDepartmentsSelect()
        $("#tableManager").modal('show')
    })

    getExistingData(0, 10);

})

function buildDepartmentsSelect() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'text',
        data: {
            key: 'buildDepartmentsSelect',
        },
        success: function(response) {
            if(response != "reachedMax") {
                    $('#departmentSelect').append(response)
                }
        }
    })
}

function getExistingData(start, limit) {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'text',
        data: {
            key: 'getExistingData',
            start: start,
            limit: limit
        },
        success: function(response) {
            if(response != "reachedMax") {
                $('tbody').append(response)
                start += limit;
                getExistingData(start, limit)
            }
        }

    })
}

function manageData(key) {
    var name = $('#employeeName')
    var surname = $('#employeeSurname')
    var jobTitle = $('#employeeJobTitle')
    var email = $('#employeeEmail')
    //var department = $('#employeeDepartment')

    if (isNotEmpty(name) && isNotEmpty(surname) && isNotEmpty(jobTitle) && isNotEmpty(email)) { //&& isNotEmpty(department)) {
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
                //department: department.val()
            },
            success: function (response) {
                alert(response)
            }

        })
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



