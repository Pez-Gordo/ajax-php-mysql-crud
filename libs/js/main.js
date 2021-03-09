// Global variable for radio buttons

var activeButton = "employees"
var scrollToTopBtn = document.getElementById("scrollToTop")
var rootElement = document.documentElement



// To manipulate the page safely we check the document is ready

$(document).ready(function() {
    $("#addNewEmployee").on('click', function() {
        buildDepartmentsSelect()
        manageModal("createEmployee", "show")
    })
    $("#addNewDepartment").on('click', function() {
        buildLocationsSelect()
        manageModal("createDepartment", "show")
    })
    $("#addNewLocation").on('click', function() {
        manageModal("createLocation", "show")
    })

    getExistingData()
    getExistingDataDep()
    getExistingDataLoc()

    $("#search").on('keyup', function() {
        var inputText = $('#search').val()
        console.log(inputText)
        setTimeout(querySearch(inputText), 200)
    })

    scrollToTopBtn.addEventListener("click", scrollToTop)
})

// Functions

// Function to read data

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
            manageModal("readEmployee", "show")
        }
    })
}

// Function to edit data

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
            console.log("updateData", response)
            $("#editRowIDUpdate").val(rowID)
            $("#employeeNameUpdate").val(response.employeeName)
            $("#employeeSurnameUpdate").val(response.employeeSurname)
            $("#employeeJobTitleUpdate").val(response.employeeJobTitle)
            $("#employeeEmailUpdate").val(response.employeeEmail)
            $("#editRowIDUpdate2").val(response.departmentID)
            buildDepartmentsSelect(response.departmentID)
            manageModal("updateEmployee", "show")
            console.log(response.departmentSelect)
        }
    })
}

// Getting info from Database to build tables

// Table Employees

function getExistingData() {

    // Ajax call to fetch data from database

    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getExistingData',
        },
        success: function(response) {
            console.log("employeesTable",response)
            if(response != "reachedMax") {
                $('#tbodyEmployees').empty()
                var rows = ""

                // Rendering Employees table

                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td><td>" + response[i][2] + "</td><td class='one'>" + response[i][3] + "</td><td class='two'>" + response[i][4] + "</td><td class='three'>" + response[i][6] + "</td>"
                    rows += "<td class='containerTD'><div><img src='./libs/img/eye.png' onclick='readData(" + response[i][0] + ")'></div>"
                    rows += "<div><img src='./libs/img/pencil.png' onclick='edit(" + response[i][0] + ")'></div>"
                    rows += "<div><img src='./libs/img/trash.png' onclick='manageModal(\"delete\", \"show\", " + response[i][0] + ")'></div></td></tr>"
                }
                $('#tbodyEmployees').append(rows)
            }
        }
    })
}

// Table Departments

function getExistingDataDep() {

    // Ajax call to get Departments data

    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getExistingDataDep',
        },
        success: function(response) {
            console.log("departmentsTable", response)
            if(response != "reachedMax") {
                $('#tbodyDepartments').empty()
                var rows = ""

                // Rendering Departments table

                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td><td>" + response[i][3] + "</td>"
                    //rows += "<td class='containerTD'><div><img src='./libs/img/trash.png' onclick='showModalDeleteDep(" + response[i][0] + ")'></div></td></tr>"
                    rows += "<td class='containerTD'><div><img src='./libs/img/trash.png' onclick='manageModal(\"deleteDep\", \"show\", " + response[i][0] + ")'></div></td></tr>"

                }
                $('#tbodyDepartments').append(rows)
            }
        }
    })
}

// Table Locations

function getExistingDataLoc() {

    // Ajax call to fetch data from locations table

    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'getExistingDataLoc',
        },
        success: function(response) {

            console.log("LocationsTable", response)
            if(response != "reachedMax") {
                $('#tbodyLocations').empty()
                var rows = ""

                // Rendering locations table

                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td>"
                    rows += "<td class='containerTD'><div><img src='./libs/img/trash.png' onclick='manageModal(\"deleteLoc\", \"show\", " + response[i][0] + ")'></div></td></tr>"
                }
                $('#tbodyLocations').append(rows)
            }
        }
    })
}

// Function for managing data

function manageData(key) {
    var name;
    var surname;
    var jobTitle;
    var email;
    var department;
    var editRowID;
    var location;

    // Create New Location

    if(key == "addNewLoc") {
        location = $("#locationName")

        // Checking location name field is not empty

        if(isNotEmpty(location)) {

            // Ajax to check there's no other location with this name

            $.ajax({
                url: './libs/php/ajax.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    key: 'checkLocation',
                    locName: location.val(),
                },
                success: function(response) {
                    console.log("<<<<--- CHECK DEP--->>>>", response)
                    if(response.length != 0) {
                        manageModal("operationFailAddLoc", "show")
                    }
                    else {

                        // Ajax to insert data in locations table and reload the table

                        $.ajax({
                            url: './libs/php/ajax.php',
                            method: 'POST',
                            dataType: 'text',
                            data: {
                                key: key,
                                name: location.val(),
                            },
                            success: function () {
                                $('#locationName').val('')
                                manageModal("createLocation", "hide")
                                manageModal("operationSuccessful", "show")
                                getExistingDataLoc()
                            }
                        })
                    }
                },
            })
        }

    // Create New Department

    }  else if(key == "addNewDep") {
        name = $("#departmentName")
        location = $('#locationSelect')
        locationID = $('#locationSelect')
        editRowIDDep = $('#editRowIDDepartment')

        // Checking form fields are not empty

        if(isNotEmpty(name) && location.val() !== "DEFAULT") {

            // Checking there's no other department in this location with the same name

            $.ajax({
                url: './libs/php/ajax.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    key: 'checkLoc',
                    depName: name.val(),
                    locID: locationID.val()
                },
                success: function(response) {
                    console.log("<<<<--- CHECK DEP--->>>>", response)
                    if(response.length != 0) {
                        manageModal("operationFailAddDep", "show")
                    }
                    else {

                        // Ajax to insert department into departments table and reload table

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
                            success: function () {
                                $('#departmentName').val('')
                                manageModal("createDepartment", "hide")
                                manageModal("operationSuccessful", "show")
                                getExistingDataDep()
                            }
                        })
                    }
                }
            })
        }
        else {
            manageModal("operationFailFillDep", "show")
        }

    // Create New Employee

    } else if(key == "addNew"){

        // Dumping form data into variables

        name = $('#employeeName')
        surname = $('#employeeSurname')
        jobTitle = $('#employeeJobTitle')
        email = $('#employeeEmail')
        department = $('#departmentSelect')
        editRowID = $("#editRowID")
        manageModal("createEmployee", "hide")

        // Checking for any empty form fields

        if (isNotEmpty(name) && isNotEmpty(surname) && isNotEmpty(jobTitle) && isNotEmpty(email) && department.val() !== "DEFAULT") {

            // Ajax to check there's no other employee with this email

            $.ajax({
                url: './libs/php/ajax.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    key: 'check',
                    emaile: email.val()
                },
                success: function(response) {
                    console.log("<<<<------>>>>", response)
                    if(response.length != 0) {
                        manageModal("operationFailEmail", "show")
                    }
                    else {

                        // Ajax to insert data in Personnel table and reload table

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
                            success: function () {
                                name.val('')
                                surname.val('')
                                jobTitle.val('')
                                email.val('')
                                department.val('DEFAULT')
                                manageModal("operationSuccessful", "show")
                                var searchText = $("#search").val()
                                if(searchText != ""){
                                    querySearch(searchText)
                                }
                                else{
                                    getExistingData()
                                }
                            },
                        })
                    }
                }
            })

        } else {
            manageModal("operationFailFill", "show")
        }

    // Update employee data

    } else if(key == "update") {

        // Dumping form data into variables

        name = $('#employeeNameUpdate')
        surname = $('#employeeSurnameUpdate')
        jobTitle = $('#employeeJobTitleUpdate')
        email = $('#employeeEmailUpdate')
        department = $('#departmentSelectUpdate')
        editRowID = $("#editRowIDUpdate")
        manageModal("updateEmployee", "hide")

        // Checking every field in the form is filled

        if (isNotEmpty(name) && isNotEmpty(surname) && isNotEmpty(jobTitle) && isNotEmpty(email) && department.val() !== "DEFAULT") {

            // Ajax call to check there's no other employee with the same email. We include rowID in ajax call to exclude the actual employee that is being updated from the query

            $.ajax({
                url: './libs/php/ajax.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    key: 'check',
                    emaile: email.val(),
                    rowID: editRowID.val()
                },
                success: function(response) {
                    console.log("<<<<------>>>>", response)
                    if(response.length != 0) {
                        manageModal("operationFailEmailUpdate", "show")
                    }
                    else {

                        // Ajax call to update employee info in database and reload table

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
                            success: function () {
                                name.val('')
                                surname.val('')
                                jobTitle.val('')
                                email.val('')
                                department.val('DEFAULT')
                                manageModal("operationSuccessful", "show")
                                var searchText = $("#search").val()
                                if(searchText != ""){
                                    querySearch(searchText)
                                }
                                else{
                                    getExistingData()
                                }
                            },
                        })
                    }
                }
            })

        } else {
            manageModal("operationFailFillUpdate", "show")
        }

    // Delete Employee

    } else if(key == "delete") {
        editRowID = $("#editRowIDDelete")
        manageModal("delete", "hide")

        // Ajax call to delete employee from database

        $.ajax({
            url: './libs/php/ajax.php',
            method: 'POST',
            dataType: 'text',
            data: {
                key: key,
                rowID: editRowID.val()
            },
            success: function () {
                var searchText = $("#search").val()
                if(searchText != ""){
                    querySearch(searchText)
                }
                else{
                    getExistingData()
                }
            }
        })

    // Delete department

    } else if(key == "deleteDep") {
        editRowID = $("#editRowIDDeleteDep")
        manageModal("delete", "hide")

        // Ajax call to check there's no dependencies pending on the selected department

        $.ajax({
            url: './libs/php/ajax.php',
            method: 'POST',
            dataType: 'json',
            data: {
                key: 'checkDelDep',
                rowID: editRowID.val()
            },
            success: function(response) {
                console.log("<<<<--- CHECK DEL DEP--->>>>", response)
                if(response.length != 0) {
                    manageModal("operationFail", "show")
                }
                else {

                    // In case of success we make another ajax to delete department

                    $.ajax({
                        url: './libs/php/ajax.php',
                        method: 'POST',
                        dataType: 'text',
                        data: {
                            key: key,
                            rowID: editRowID.val()
                        },
                        success: function () {
                            manageModal("operationSuccessful", "show")
                            getExistingDataDep()
                        }
                    })
                }
            },
        })

    // Delete Location

    } else if(key == "deleteLoc") {
        editRowID = $("#editRowIDDeleteLoc")
        manageModal("delete", "hide")

        // Ajax call to check for dependencies

        $.ajax({
            url: './libs/php/ajax.php',
            method: 'POST',
            dataType: 'json',
            data: {
                key: 'checkDelLoc',
                rowID: editRowID.val()
            },
            success: function(response) {
                console.log("<<<<--- CHECK DEL LOC--->>>>", response)
                if(response.length != 0) {
                    manageModal("operationFail", "show")
                }
                else {

                    // In case of success we make another ajax to delete location

                    $.ajax({
                        url: './libs/php/ajax.php',
                        method: 'POST',
                        dataType: 'text',
                        data: {
                            key: key,
                            rowID: editRowID.val()
                        },
                        success: function () {
                            manageModal("operationSuccessful", "show")
                            getExistingDataLoc()
                        }
                    })
                }
            },
        })
    }
}

// Checking for empty fields

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

// Building Departments Select

function buildDepartmentsSelect(depID) {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'buildDepartmentsSelect',
        },
        success: function(response) {
            console.log("departmentsSelect", response)
            if(response != "reachedMax") {
                $('#departmentSelect').empty()
                var rows = "<option>Select Department</option>"

                for(var i = 0; i < response.length; i++) {
                    if(response[i][0] == depID) {
                        rows += "<option value=" + response[i][0] + " selected>" + response[i][1] + "</option>"
                    }
                    else {
                        rows += "<option value=" + response[i][0] + ">" + response[i][1] + "</option>"
                    }
                }
                $('#departmentSelect').append(rows)
                $('#departmentSelectUpdate').append(rows)
            }
        }
    })
}

// Building Locations Select

function buildLocationsSelect() {
    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'buildLocationsSelect',
        },
        success: function(response) {
            console.log("locationSelect", response)
            if(response != "reachedMax") {
                $('#locationSelect').empty()

                var rows = "<option selected value='DEFAULT'>Select Location</option>"

                for(var i = 0; i < response.length; i++) {
                    rows += "<option value=" + response[i][0] + ">" + response[i][1] + "</option>"
                }
                $('#locationSelect').append(rows)
            }
        }
    })
}

// Managing modals

function manageModal(modal, key, id) {
    if (key == "show"){
        switch(modal) {
            case "createEmployee":
                $("#tableManager").modal('show')
                break;
            case "readEmployee":
                $("#tableManagerRead").modal('show')
                break;
            case "createDepartment":
                $("#tableManagerDepartment").modal('show')
                break;
            case "updateEmployee":
                $("#tableManagerUpdate").modal('show')
                break;
            case "operationSuccessful":
                $("#tableManagerOpSucc").modal('show')
                break;
            case "operationFail":
                $("#tableManagerOpFail").modal("show")
                break;
            case "operationFailFill":
                $("#tableManagerOpFailFill").modal("show")
                break;
            case "operationFailFillDep":
                $("#tableManagerOpFailFillDepartment").modal("show")
                break;
            case "operationFailFillUpdate":
                $("#tableManagerOpFailFillUpdate").modal("show")
                break;
            case "operationFailEmail":
                $("#tableManagerOpFailEmail").modal('show')
                break;
            case "operationFailEmailUpdate":
                $("#tableManagerOpFailEmailUpdate").modal('show')
                break;
            case "operationFailAddDep":
                $('#tableManagerOpFailAddDep').modal('show')
                break;
            case "operationFailAddLoc":
                $('#tableManagerOpFailAddLoc').modal('show')
                break;
            case "createLocation":
                $("#tableManagerLocation").modal('show')
                break;
            case "delete":
                $("#tableManagerDelete").modal('show')
                $("#editRowIDDelete").val(id)
                $("#editRowIDDeleteDep").val(id)
                $("#editRowIDDeleteLoc").val(id)
                break;
            case "deleteDep":
                $("#tableManagerDeleteDep").modal('show')
                $("#editRowIDDelete").val(id)
                $("#editRowIDDeleteDep").val(id)
                $("#editRowIDDeleteLoc").val(id)
                break;
            case "deleteLoc":
                $("#tableManagerDeleteLoc").modal('show')
                $("#editRowIDDelete").val(id)
                $("#editRowIDDeleteDep").val(id)
                $("#editRowIDDeleteLoc").val(id)
                break;

        }
    }
    else if (key == "hide") {
        switch(modal) {
            case "createEmployee":
                $("#tableManager").modal('hide')
                break;
            case "readEmployee":
                $("#tableManagerRead").modal('hide')
                break;
            case "createDepartment":
                $("#tableManagerDepartment").modal('hide')
                break;
            case "updateEmployee":
                $("#tableManagerUpdate").modal('hide')
                break;
            case "operationSuccessful":
                $("#tableManagerOpSucc").modal('hide')
                break;
            case "operationFail":
                $("#tableManagerOpFail").modal("hide")
                break;
            case "operationFailFill":
                $("#tableManagerOpFailFill").modal("hide")
                break;
            case "operationFailFillDep":
                $("#tableManagerOpFailFillDepartment").modal("hide")
                break;
            case "operationFailFillUpdate":
                $("#tableManagerOpFailFillUpdate").modal("hide")
                break;
            case "operationFailEmail":
                $("#tableManagerOpFailEmail").modal('hide')
                break;
            case "operationFailEmailUpdate":
                $("#tableManagerOpFailEmailUpdate").modal('hide')
                break;
            case "operationFailAddDep":
                $('#tableManagerOpFailAddDep').modal('hide')
                break;
            case "operationFailAddLoc":
                $('#tableManagerOpFailAddLoc').modal('hide')
                break;
            case "createLocation":
                $("#tableManagerLocation").modal('hide')
                break;
            case "delete":
                $("#tableManagerDelete").modal('hide')
                $("#tableManagerDeleteDep").modal('hide')
                $("#tableManagerDeleteLoc").modal('hide')
                break;
        }
    }
}

function todos() {
    manageModal("operationFailEmail", "hide")
    manageModal("createEmployee", "show")
}

function todosUpdate() {
    manageModal("operationFailEmailUpdate", "hide")
    manageModal("updateEmployee", "show")
}


function todosAddDep() {
    manageModal("operationFailAddDep", "hide")
    manageModal("createDepartment", "show")
}

function todosAddLoc() {
    manageModal("operationFailAddLoc", "hide")
    showModalAddLoc()
}

function todosFailFill() {
    manageModal("operationFailFill", "hide")
    manageModal("createEmployee", "show")
}

function todosFailFillUpdate() {
    manageModal("operationFailFillUpdate", "hide")
    manageModal("updateEmployee", "show")
}

function todosFailFillCreate() {
    manageModal("operationFailFill", "hide")
    manageModal("createEmployee", "show")
}

function todosFailFillDep() {
    manageModal("operationFailFillDep", "hide")
    manageModal("createDepartment", "show")
}

// Bootstrap Radio Button controls to toggle between different tables

$('#tableDepartments').hide()
$('#tableLocations').hide()
$('#addNewDepartment').hide()
$('#addNewLocation').hide()

document.getElementById("btnradio1").addEventListener("click", function() {
    $('#tableDepartments').hide()
    $('#tableLocations').hide()
    $('#tableEmployees').show()
    $('#addNewDepartment').hide()
    $('#addNewLocation').hide()
    $('#addNewEmployee').show()
    $("#employeesImg").attr("src", "./libs/img/employeesSel.png")
    $("#departmentsImg").attr("src", "./libs/img/departments.png")
    $("#locationsImg").attr("src", "./libs/img/locations.png")
    $("#search").show()
    activeButton = "employees"
  });

document.getElementById("btnradio2").addEventListener("click", function() {
    $('#tableEmployees').hide()
    $('#tableLocations').hide()
    $('#tableDepartments').show()
    $('#addNewDepartment').show()
    $('#addNewLocation').hide()
    $('#addNewEmployee').hide()
    $("#employeesImg").attr("src", "./libs/img/employees.png")
    $("#departmentsImg").attr("src", "./libs/img/departmentsSel.png")
    $("#locationsImg").attr("src", "./libs/img/locations.png")
    $("#search").hide()
    activeButton = "departments"
});

document.getElementById("btnradio3").addEventListener("click", function() {
    $('#tableEmployees').hide()
    $('#tableDepartments').hide()
    $('#tableLocations').show()
    $('#addNewDepartment').hide()
    $('#addNewLocation').show()
    $('#addNewEmployee').hide()
    $("#employeesImg").attr("src", "./libs/img/employees.png")
    $("#departmentsImg").attr("src", "./libs/img/departments.png")
    $("#locationsImg").attr("src", "./libs/img/locationsSel.png")
    $("#search").hide()
    activeButton = "locations"
});

// Functions to manage hover changing styles

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

// implementing search input

function querySearch(text) {
    textKeyword = text + "%"
    var query = `SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.dname FROM personnel LEFT JOIN department ON personnel.departmentID = department.id WHERE personnel.lastName LIKE '${textKeyword}' ORDER BY lastName ASC`

    // Ajax call for every keystroke to check for coincidences in surname column of employees table

    $.ajax({
        url: './libs/php/ajax.php',
        method: 'POST',
        dataType: 'json',
        data: {
            key: 'querySearch',
            query: query
        },
        success: function (response) {
            console.log("searchTable",response)
            if(response != "reachedMax") {
                $('#tbodyEmployees').empty()
                var rows = ""

                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td><td>" + response[i][2] + "</td><td class='one'>" + response[i][3] + "</td><td class='one'>" + response[i][4] + "</td><td class='two'>" + response[i][6] + "</td>"
                    rows += "<td class='containerTD'><div><img src='./libs/img/eye.png' onclick='readData(" + response[i][0] + ")'></div>"
                    rows += "<div><img src='./libs/img/pencil.png' onclick='edit(" + response[i][0] + ")'></div>"
                    rows += "<div><img src='./libs/img/trash.png' onclick='manageModal(\"delete\", \"show\", " + response[i][0] + ")'></div></td></tr>"
                }
                $('#tbodyEmployees').append(rows)
            }
            else {
                $('#tbodyEmployees').empty()
                alert("No matches found")
            }
        }
    })
}

// Implementing Scroll-to-top button

function scrollToTop() {
  // Scroll to top logic
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
