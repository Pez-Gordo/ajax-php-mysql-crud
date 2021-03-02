$(document).ready(function() {
    $("#addNew").on('click', function() {
        $("#tableManager").modal('show')
    })
})

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



