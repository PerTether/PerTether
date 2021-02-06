"""front URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from frontApp import views

urlpatterns = [
    url('admin/', admin.site.urls),
    url('deal/', views.deal),
    url('experiment/', views.experiment),
    url('detailedResult/', views.detailed_result),
    url('list/', views.task_list, name='task_list'),
    url('testConfig/', views.test_config),
    url('load/', views.load),
    url('user_login/', views.login),
    url('user_signup/', views.signup),
    url('login/', views.login_view, name='login_view'),
    url('signup/', views.signup_view),
    url('logout/', views.logout),
    url('delete/', views.delete),
    url('profile/', views.profile),
]
