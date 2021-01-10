

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

// facebook login entrypoint
// window.fbAsyncInit = function() {
//     FB.init({
//       appId            : '3546525952134892',
//       autoLogAppEvents : true,
//       xfbml            : true,
//       version          : 'v2.8'
//     });    
// };
// (function(d, s, id){
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
//   }(document, 'script', 'facebook-jssdk')); 

// function statusChangeCallback(response){
//     console.log(response);
// }  

// get providers auth code which is passed to backend for the actual API call
async function getProviderInfo(type, data){    

    if (type == 'google') {        
        return data = await auth2.grantOfflineAccess().then(function(authResult){
            data['provider'] = 'google';
            data['token'] = authResult['code'];
            return data;            
        });                        
    } 
    //else if (type == 'facebook'){
    //     // FB.getLoginStatus(function(response) {
    //     //     statusChangeCallback(response);
    //     // }); 
    //    console.log(await FB.getAuthResponse())
    //    //console.log(authcode);

    // }       
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
