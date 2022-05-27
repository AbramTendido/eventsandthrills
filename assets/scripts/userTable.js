var el = document.getElementById('result');
var names = [];
var emails = [];

// Create User
function Create() {
    var el = document.getElementById('userName')
    var elEm = document.getElementById('userEmail')
    var name = el.value;
    var email = elEm.value;
    if (name) {
        names.push(name.trim());
        emails.push(email.trim());
        el.value = '';
        elEm.value = '';
        displayData();
    }
    displayData();
};

// Delete
function Delete(item) {
    names.splice(item, 1);
    emails.splice(item, 1)
    displayData();

};

// Edit User
function Edit(item) {
    var editDoc = document.getElementById('updateName');
    var editDoc1 = document.getElementById('updateEmail');
    editDoc.value = names[item];
    editDoc1.value = emails[item];
    document.getElementById('editUser').style.display = 'inline';
    document.getElementById('createUser').style.display = 'none';
    self = this;

    document.getElementById('update').onsubmit = function() {
        var name = editDoc.value;
        var email = editDoc1.value;
        if (name) {
            self.names.splice(item, 1, name.trim());
            self.emails.splice(item, 1, email.trim());
            self.displayData();
            buttonToggle();
            document.getElementById('createUser').style.display = 'inline';
        }
    }
};

// Button
function buttonToggle() {
    document.getElementById('editUser').style.display = 'none';
    document.getElementById('createUser').style.display = 'inline';
}

// Change button display 
function displayData() {
    var data = '';
    if (names.length > 0) {
        for (i = 0; i < names.length; i++) {
            data += '<tr>';
            data += '<td>' + names[i] + '</td>';
            data += '<td>' + emails[i] + '</td>';
            data += '<td colspan="2"><center><button class="btn btn-warning" onclick="Edit(' + i + ')"><i class="fas fa-edit"></i> Edit</button> | <button class="btn btn-danger" onclick="Delete(' + i + ')"><i class="fas fa-trash"></i> Delete</button></center></td>';
            data += '</tr>';
        }
    }

    el.innerHTML = data;
};

// var members = JSON.parse(localStorage.getItem("members"));
// function Load() {
//     for (i = 0; i < members.length; i++) {
//         let newRow = document.createElement("tr")
//         newRow.innerHTML = `
//         <td>${members[e].id}</td>
//         <td>${members[e].name}</td>`
//         el.append(newRow)
//     }
//     displayData();
// }

displayData();
buttonToggle();