let members = JSON.parse(localStorage.getItem("members"));
console.log(members)

//Login Function
function loginFn(e) {
    e.preventDefault();
    let data = {};
    const elements = e.target.elements;
    console.log(typeof(elements));

    for (var i = 0; i < elements.length; i++) {
        data[elements[i].id] = elements[i].value;
    }

    console.log(data)

    let loggedUser = {

        email: data.loginEmail,
        password: data.loginPassword,

    };

    let memberFind = members.find(function(member, index) {
        if (member.email == loggedUser.email)
            return member
    })

    //Find member
    if (memberFind) {
        //Alert Success
        if (memberFind.password == loggedUser.password) {
            Swal.fire({
                title: "Login Success",
                text: "Succesully logged in!",
                icon: "success",
                confirmButtonText: "Continue",
            }).then(function() {
                window.location = "users.html";
            });

            localStorage.setItem("currentUser", JSON.stringify(memberFind));

        }
        //Alert Fail
        else {
            Swal.fire({
                title: "Login Failed..",
                text: "Wrong email or password!",
                icon: "error",
                confirmButtonText: "Retry",
            });
            $(".login").trigger("reset")
        }
    }
    //No Member
    else {
        Swal.fire({
            title: "Login Failed..",
            text: "Wrong email or password!",
            icon: "error",
            confirmButtonText: "Retry",
        });
        $(".login").trigger("reset")
    }
};

$(".login").on("submit", loginFn)