

/* CALLING GOOGLE REST LOGIN API */

    // google login entrypoint
    start();
    function start() {
        gapi.load('auth2', function(){
            auth2 = gapi.auth2.init({
                client_id: "283912086812-tlsu5g6d1djkmbpf3df448gknj6ekqn8.apps.googleusercontent.com"
            });
        });
    }

    // callback to send authentication code to backend
    function signInCallback(authResult){
        if (authResult['code']) {
            // $.ajax({
            //     type: 'POST',
            //     url: 'login_user',
            //     headers: {
            //         'X-Requested-With': 'XMLHttpRequest'
            //     },
            //     contentType: "application/json",
            //     dataType: "json",
            //     data: JSON.stringify({"type": "google", "token": authResult['code']}),
            //     success: function(response){
            //         var error = response["error"];
            //         if (error){
            //             alert(error);
            //         } 
            //         else{
            //             //genProfile();
            //             console.log("show profile");
            //             window.location.reload()
            //             //window.location.href = "/chat";
            //         }    
            //     }
            // });
            //console.log($('#google-form input[name=csrfmiddlewaretoken]').val());
            console.log($('#login-form input[name=csrfmiddlewaretoken]').val());
            var data = {
                "provider": "google",
                "token": authResult['code'],
                csrfmiddlewaretoken: $('#login-form input[name=csrfmiddlewaretoken]').val()
            };
            $.post("social_login", JSON.stringify(data), function(response){
                console.log(response);
            });
        }
    }
    // attach callback on click of google login button
    // $("#google-signin").on("click", function(){        
    //     auth2.grantOfflineAccess().then(signInCallback);
    // });
    // $("#google-login").on("click", function(event){
    //     event.preventDefault();
    //     console.log("submitted google");
    //     auth2.grantOfflineAccess().then(signInCallback);
    // });


async function getProviderInfo(type, data){    

    if (type == 'google') {        
        return data = await auth2.grantOfflineAccess().then(function(authResult){
            data['provider'] = 'google';
            data['token'] = authResult['code'];
            return data;            
        });                        
    } 
}


/* SUBMIT LOGIN DATA TO BACKEND */

$("#login-form").on("click", function(event){

    event.preventDefault();      

    var type = $(event.target).attr("name");

    var data = {
        csrfmiddlewaretoken: $('#login-form input[name=csrfmiddlewaretoken]').val()
    };
    
    // code for normal login

    if (type === undefined){

        var email_input = document.getElementById("email-input").value;
        var password_input = document.getElementById("password-input").value;            
        
        data['email'] = email_input;
        data['password'] = password_input;  
        
        $.post("login_user", data, function(response){
            document.getElementById("login-form-err").innerHTML = "";
            var error = response['error'];
            if (error)
                document.getElementById("login-form-err").innerHTML = error;         
            else
                window.location.href = "/";
        });
    }        
    else {

        // code for social login
        
        getProviderInfo(type, data).then(
            (data) => {
                console.log(data);
                $.post("social_login", data, function(response){
                    document.getElementById("login-form-err").innerHTML = "";
                    var error = response['error'];
                    if (error)
                        document.getElementById("login-form-err").innerHTML = error;         
                    else
                        window.location.href = "/";
                });
            }
        );
    }          
});
