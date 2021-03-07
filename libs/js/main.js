var activeButton = "employees"

$(document).ready(function() {
    $("#addNewEmployee").on('click', function() {
        buildDepartmentsSelect()
        $("#tableManager").modal('show')
    })
    $("#addNewDepartment").on('click', function() {
        buildLocationsSelect()
        showModalAddDep()
        
    })
    $("#addNewLocation").on('click', function() {
        $("#tableManagerLocation").modal('show')
    })

    getExistingData()
    getExistingDataDep()
    getExistingDataLoc()
    
    

    $("#search").on('keyup', function() {
        var inputText = $('#search').val()
        console.log(inputText)
        setTimeout(querySearch(inputText), 200)
    })
 
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
            console.log("updateData", response)
            $("#editRowIDUpdate").val(rowID)
            $("#employeeNameUpdate").val(response.employeeName)
            $("#employeeSurnameUpdate").val(response.employeeSurname)
            $("#employeeJobTitleUpdate").val(response.employeeJobTitle)
            $("#employeeEmailUpdate").val(response.employeeEmail)
            $("#editRowIDUpdate2").val(response.departmentID)
            buildDepartmentsSelect(response.departmentID)
            showModalUpdate()
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
            console.log("employeesTable",response)
            if(response != "reachedMax") {
                $('#tbodyEmployees').empty()
                var rows = ""
                
                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td><td>" + response[i][2] + "</td><td class='one'>" + response[i][3] + "</td><td class='two'>" + response[i][4] + "</td><td class='three'>" + response[i][6] + "</td>"
                    rows += "<td class='containerTD'><div><img src='./libs/img/eye.png' onclick='readData(" + response[i][0] + ")'></div>"
                    rows += "<div><img src='./libs/img/pencil.png' onclick='edit(" + response[i][0] + ")'></div>"
                    rows += "<div><img src='./libs/img/trash.png' onclick='showModalDelete(" + response[i][0] + ")'></div></td></tr>"
                }
                $('#tbodyEmployees').append(rows)   
            }
        }
    })
}

function getExistingDataDep() {
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
                
                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td><td>" + response[i][3] + "</td>"
                    rows += "<td class='containerTD'><div><img src='./libs/img/trash.png' onclick='showModalDeleteDep(" + response[i][0] + ")'></div></td></tr>"
                }
                $('#tbodyDepartments').append(rows)   
            }
        }

    })
}

function getExistingDataLoc() {
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
                
                for(var i = 0; i < response.length; i++) {
                    rows += "<tr><td>" + response[i][1] + "</td>"
                    rows += "<td class='containerTD'><div><img src='./libs/img/trash.png' onclick='showModalDeleteLoc(" + response[i][0] + ")'></div></td></tr>"
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
        location = $("#locationName")
             
        if(isNotEmpty(location)) {
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
                        showModalOpFailAddLoc()
                    }
                    else {
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
                                closeModalCreateLoc()
                                showModalOpSucc() 
                                getExistingDataLoc()
                            }
                        })
                    }
                },
            })
        }
        else {
            showModalOpFailFill()
        }
    
    }  else if(key == "addNewDep") {
        name = $("#departmentName")
        location = $('#locationSelect')
        locationID = $('#locationSelect')
        editRowIDDep = $('#editRowIDDepartment')

        if(isNotEmpty(name) && location.val() !== "DEFAULT") {
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
                        showModalOpFailAddDep()
                    }
                    else {
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
                                closeModalCreateDep()
                                showModalOpSucc() 
                                getExistingDataDep()
                            }
                        })
                    }
                }
            })
        }
        else {
            showModalOpFailFill() 
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
                var searchText = $("#search").val()
                if(searchText != ""){
                    querySearch(searchText)
                }
                else{
                    getExistingData()
                }
            }
        })
    } else if(key == "deleteDep") {
        editRowID = $("#editRowIDDeleteDep")
        closeModalDelete()
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
                    showModalOpFail()
                }
                else {

                    $.ajax({
                        url: './libs/php/ajax.php',
                        method: 'POST',
                        dataType: 'text',
                        data: {
                            key: key,
                            rowID: editRowID.val()
                        },
                        success: function () {
                            showModalOpSucc()
                            getExistingDataDep()
                        }
                    })
                }
            },
        })
    } else if(key == "deleteLoc") {
        editRowID = $("#editRowIDDeleteLoc")
        closeModalDelete()
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
                    showModalOpFail()
                }
                else {
                    $.ajax({
                        url: './libs/php/ajax.php',
                        method: 'POST',
                        dataType: 'text',
                        data: {
                            key: key,
                            rowID: editRowID.val()
                        },
                        success: function () {
                            showModalOpSucc()
                            getExistingDataLoc()  
                        }
                    })
                }
            },
        })
    }

    if(key != "delete" && key != "addNewDep" && key != "addNewLoc" && key != "deleteDep" && key != "deleteLoc"){
        if (isNotEmpty(name) && isNotEmpty(surname) && isNotEmpty(jobTitle) && isNotEmpty(email) && department.val() !== "DEFAULT") {
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
                        showModalOpFailEmail()
                    }
                    else {
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
                                showModalOpSucc() 
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

function showModalAddDep() {
    $("#tableManagerDepartment").modal('show')
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

function showModalOpFailEmail() {
    $("#tableManagerOpFailEmail").modal('show')
}

function closeModalOpFailEmail() {
    $('#tableManagerOpFailEmail').modal('hide')
}

function showModalOpFailAddDep(){
    $('#tableManagerOpFailAddDep').modal('show')
}

function closeModalOpFailAddDep(){
    $('#tableManagerOpFailAddDep').modal('hide')
}

function showModalOpFailAddLoc(){
    $('#tableManagerOpFailAddLoc').modal('show')
}

function closeModalOpFailAddLoc(){
    $('#tableManagerOpFailAddLoc').modal('hide')
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

function todos() {
    closeModalOpFailEmail()
    showModalUpdate()
}

function todosAddDep() {
    closeModalOpFailAddDep()
    showModalAddDep()
}

function todosAddLoc() {
    closeModalOpFailAddLoc()
    showModalAddLoc()
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
    //var text = $("#search").val()
    textKeyword = text + "%"
    console.log(text)
    
    //var query = `SELECT * FROM personnel WHERE lastName LIKE '${textKeyword}'`
    //var query = "SELECT * FROM personnel WHERE id < 15"

    console.log(query)
    var query = `SELECT personnel.id, personnel.firstName, personnel.lastName, personnel.jobTitle, personnel.email, personnel.departmentID, department.dname FROM personnel LEFT JOIN department ON personnel.departmentID = department.id WHERE personnel.lastName LIKE '${textKeyword}' ORDER BY lastName ASC`
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
                    rows += "<div><img src='./libs/img/trash.png' onclick='showModalDelete(" + response[i][0] + ")'></div></td></tr>"
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



