from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from .forms import *
from .models import *
from oauth2client import client
from django.conf import settings

def register_template(request):
    return render(request, "register.html")

def login_template(request):
    return render(request, "login.html")

# generate unique username
def get_username(first_name):
    username = first_name
    if User.objects.filter(username__iexact=first_name).exists():
        count = User.objects.filter(username__iexact=first_name).count()
        username += str(count)
    return username

# register user here
def register_user(request):
    response = {}
    try:
        if request.is_ajax():
            form_class = RegisterForm    
            form = form_class(request.POST)
            if form.is_valid():                
                if User.objects.filter(email=form.cleaned_data['email']).exists():
                    response.update({"error": "email already registered"})
                else:    
                    user = form.save(commit=False)
                    user.first_name = form.cleaned_data['first_name'].lower()
                    user.last_name = form.last_name = form.cleaned_data['last_name'].lower()
                    user.username = get_username(user.first_name)
                    password = form.cleaned_data['password']
                    user.set_password(password)
                    user.save()                
    except Exception:            
        response.update({"error": "something went wrong."})        
    return JsonResponse(response)

# get last name of user if any
def get_lastname(data, first_name):
    last_name = ""
    if "family_name" in data.keys():
        last_name = data["family_name"].lower()
    else:
        name = data["name"]
        if name.isspace():
            name = name.split(" ").lower()
            if name.length > 1:
                if name[-1] != first_name:
                    last_name = name[-1]
    return last_name   

# login user using his/her social account
def social_login(request):
    response = {}
    try:
        if request.is_ajax():
            provider = request.POST.get('provider').lower()
            if provider == "google":    
                auth_token = request.POST.get('token')
                print("auth token")
                print(auth_token)
                try:                    
                    credentials = client.credentials_from_clientsecrets_and_code(
                        settings.CLIENT_SECRETS_JSON, ['profile'],
                        auth_token
                    )
                    print("credentials are:")
                    data = credentials.id_token
                    email = data['email']
                    user = User.objects.filter(email=email).first()
                    if user is None :                        
                        first_name = data['given_name'].lower()
                        last_name = get_lastname(data, first_name)                    
                        username = get_username(first_name)
                        user = User(
                            first_name=first_name,
                            last_name=last_name,
                            email=email,
                            username=username
                        )
                        user.set_password("")
                        user.save()     
                    login(request, user, backend='django.contrib.auth.backends.ModelBackend')    
                    #login(request, user)    
                except Exception as e:
                    print(e)         
                    response.update({"error": "something went wrong."})                    
        elif provider == 'facebook':
            print("facebook token")    
    except Exception:
        response.update({"error":"something went wrong."})
    return JsonResponse(response)                           


 # login the user here
def login_user(request):
    response = {}
    try:           
        if request.is_ajax():
            email = request.POST.get('email')
            password = request.POST.get('password')                                    
            user = authenticate(username=email, password=password)                                      
            if user:
                login(request, user) 
            else:
                response.update({"error": "Invalid username or password."})           
        else:
            response.update({"error": "Only ajax request accepted."})        
    except Exception:
        response.update({"error": "Something went wrong."}) 
    return JsonResponse(response)    

# logout user here
def logout_user(request):
    logout(request)
    return redirect('/')    