

/* LOGIN FORM */

function login(event){

    event.preventDefault();

    // field values
    var email_input = document.getElementById("email-input").value;
    var password_input = document.getElementById("password-input").value;

    // send to backend

    var data = {
        'email': email_input,
        'password': password_input,
        csrfmiddlewaretoken: $('#login-form input[name=csrfmiddlewaretoken]').val()

    };        

    $.post("login_user", data, function(response){
        document.getElementById("login-form-err").innerHTML = "";
        var error = response['error'];
        if (error)
            document.getElementById("login-form-err").innerHTML = error;         
        else
            window.location.href = "/";
    });
}
