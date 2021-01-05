from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from .forms import *
from .models import *

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


 # login the user here
def login_user(request):
    response = {}
    try:
        print("working inside")        
        if request.is_ajax():
            email = request.POST.get('email')
            password = request.POST.get('password')            
            user = authenticate(username=email, password=password)
            print(user)
            if user:
                login(request, user)
            else:    
                response.update({"error": "Invalid username or password"})
    except Exception:
        response.update({"error": "something went wrong."}) 
    return JsonResponse(response)    

# logout user here
def logout_user(request):
    logout(request)
    return redirect('/')    