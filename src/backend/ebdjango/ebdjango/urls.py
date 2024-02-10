
"""ebdjango URL Configuration

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
from django.urls import include, path

from ebdjango import views






urlpatterns = [

    path('admin/', admin.site.urls),
    path('users/', views.users_view, name='users'),
    path('drugs/', views.drugs_view, name='drugs'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('paid/', views.drugs_payed_view, name='paid'),
    path('populate/',views.populate_face_view, name='populate'),
    path('verifyPhoto/',views.verify_photo_view,name='verifyPhoto'),
    path('ongoing/',views.get_on_going_view,name='ongoing'),
  

   
]
