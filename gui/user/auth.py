from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from db import db_helper


def user_login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return True
    else:
        return False


def user_logout(request):
    logout(request)


def user_is_login(request):
    return request.user.is_authenticated()


def sign_up(request):
    username = request.POST['username']
    password = request.POST['password']
    first_name = request.POST['first_name']
    last_name = request.POST['last_name']
    email = request.POST['email']
    user_type = request.POST['type']
    user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name, email=email)
    if user is not None:
        db_helper.create_new_user(username, user_type)
        return True
    else:
        return False
