from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailOrUsernameBackend(object):
    '''
    This is a backend for allowing user to login
    with username or email.
    '''    

    def authenticate(self, request, username=None, password=None, **kwargs):
       
        if '@' in username:
            kwargs = {'email': username}
        else:
            kwargs = {'username': username}            
        try:
            user = UserModel.objects.get(**kwargs)
            if user.check_password(password):
                return user
            return None    
        except UserModel.DoesNotExist:
            return None  

    def get_user(self, user_id):
        try:            
            return UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExit:
            return None    