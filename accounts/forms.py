from django.forms import ModelForm, CharField, EmailField, PasswordInput
from django.core.validators import RegexValidator
from .models import User
from django.contrib.auth import get_user_model

password_regex = "^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-z\d@$!%*#?&]{6,}$"

class RegisterForm(ModelForm):
    first_name = CharField(validators=[RegexValidator("^[a-zA-Z]{3,30}$")])
    last_name = CharField(validators=[RegexValidator("^[a-zA-Z]{3,30}$")])
    email = EmailField()
    password = CharField(widget=PasswordInput, validators=[RegexValidator(password_regex)])    

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password'] 

