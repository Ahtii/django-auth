
/* FIELD VALIDATORS */

// First Name Validator

function validateFirstName(event){
    document.getElementById("firstname-err").innerHTML = "";    
    var val = event.target.value; 
    var pattern = /^[a-z]{3,30}$/i;
    if (!pattern.test(val))
        document.getElementById("firstname-err").innerHTML = "Min 3 and Max 30 without space, digit or special characters";
}   

// Last Name Validator

function validateLastName(event){
    document.getElementById("lastname-err").innerHTML = "";    
    var val = event.target.value; 
    var pattern = /^[a-z]{3,30}$/i;
    if (!pattern.test(val))
        document.getElementById("lastname-err").innerHTML = "Min 3 and Max 30 without space, digit or special characters";
}   

// Email Validator

function validateEmail(event){
    document.getElementById("email-err").innerHTML = "";    
    var val = event.target.value; 
    var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i;
    if (!pattern.test(val))
        document.getElementById("email-err").innerHTML = "Invalid email format";
}

// Password Validator

function validatePassword(event){
    document.getElementById("password-err").innerHTML = "";    
    var val = event.target.value; 
    var pattern = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-z\d@$!%*#?&]{6,}$/i;
    if (!pattern.test(val))
        document.getElementById("password-err").innerHTML = "Min 6 & at least one letter, number & special character";
}   

/* REGISTER FORM */

function register(event){

    event.preventDefault();

    // error messages
    var firstname_err = document.getElementById("firstname-err").innerHTML;
    var lastname_err = document.getElementById("lastname-err").innerHTML;
    var email_err = document.getElementById("email-err").innerHTML;
    var password_err = document.getElementById("password-err").innerHTML;

    if (!(firstname_err || lastname_err || email_err || password_err)){
        
        // field values
        var firstname_input = document.getElementById("firstname-input").value;
        var lastname_input = document.getElementById("lastname-input").value;
        var email_input = document.getElementById("email-input").value;
        var password_input = document.getElementById("password-input").value;

        // send to backend

        var data = {
            'first_name': firstname_input,
            'last_name': lastname_input,
            'email': email_input,
            'password': password_input,
            csrfmiddlewaretoken: $('#register-form input[name=csrfmiddlewaretoken]').val()

        };        

        $.post("register_user", data, function(response){
            document.getElementById("register-form-err").innerHTML = "";
            var error = response['error'];
            if (error)
                document.getElementById("register-form-err").innerHTML = error;         
            else
                window.location.href = "accounts/login";
        });
    }
}
