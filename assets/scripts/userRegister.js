let members = JSON.parse(localStorage.getItem("members"));

if (members == null) {
    members = [];

}

// Register Function
function registerFn(e) {
    e.preventDefault();
    let data = {};
    const elements = e.target.elements;
    for (var i = 0; i < elements.length; i++) {
        data[elements[i].name] = elements[i].value;
    }
    let user = {
        id: members.length + 1,
        name: data.registerFirstName + " " + data.registerLastName,
        email: data.email,
        password: data.password,
    };
    members.push(user);
    localStorage.setItem("members", JSON.stringify(members));
    Swal.fire({
        title: "Confirmation",
        text: "Registration successful!",
        icon: "success",
        confirmButtonText: "Continue",
    }).then(function() {
        window.location = "./login.html";
    });
    return true;
};

$("#registration").on("submit", registerFn)