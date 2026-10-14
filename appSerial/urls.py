from django.urls import path, include
from . import views

app_name='appSerial'

urlpatterns = [
    path('',views.index,name='index'),
    path('crearUsuario',views.crearUsuario,name='crearUsuario'),
    path('consultarUsuarios',views.consultarUsuarios,name='consultarUsuarios'),
    path('consultarDispositivos',views.consultarDispositivos,name='consultarDispositivos'),
    path('crearDispositivo',views.crearDispositivo,name='crearDispositivo'),
    path('crearRegistro',views.crearRegistro,name='crearRegistro'),
    path('consultarRegistros',views.consultarRegistros,name='consultarRegistros'),
    path('conseguirDatos/<str:idRegistro>',views.conseguirDatos,name='conseguirDatos')
]
