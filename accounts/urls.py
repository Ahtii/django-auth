from django.urls import path

from . import views

urlpatterns = [    
    path('register', views.register_template, name='register'),
    path('login', views.login_template, name='login'),
    path('register_user', views.register_user, name='register_user'),
    path('login_user', views.login_user, name='login_user'),
    path('social_login', views.social_login, name='social_login'),
    path('logout', views.logout_user, name='logout')
]