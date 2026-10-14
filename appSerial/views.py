from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
import json
from .models import usuarioSistema, dispositivoSistema, registroSistema, datoSistema

@ensure_csrf_cookie
def index(request):
    return render(request,'index.html')

def crearUsuario(request):
    if request.method == 'POST':
        datos = json.load(request)
        nombreUsuario = datos.get('nombreUsuario')
        apellidoUsuario = datos.get('apellidoUsuario')
        edadUsuario = datos.get('edadUsuario')
        profesionUsuario = datos.get('profesionUsuario')
        usuarioSistema.objects.create(
            nombreUsuario=nombreUsuario,
            apellidoUsuario=apellidoUsuario,
            edadUsuario=edadUsuario,
            profesionUsuario=profesionUsuario
        )
        return JsonResponse({
            'resp':'ok'
        })
    
def consultarUsuarios(request):
    usuariosTotales = usuarioSistema.objects.all().order_by('id')
    usuariosSistema = []
    for usuarioInfo in usuariosTotales:
        usuariosSistema.append({
            'id':usuarioInfo.id,
            'nombreUsuario':usuarioInfo.nombreUsuario,
            'apellidoUsuario':usuarioInfo.apellidoUsuario,
            'edadUsuario':usuarioInfo.edadUsuario,
            'profesionUsuario':usuarioInfo.profesionUsuario
        })
    return JsonResponse({
        'usuariosSistema':usuariosSistema
    })

def consultarDispositivos(request):
    dispositivosTotales = dispositivoSistema.objects.all().order_by('id')
    dispositivosSistema = []
    for dispositivoInfo in dispositivosTotales:
        dispositivosSistema.append({
            'id':dispositivoInfo.id,
            'nombreDispositivo':dispositivoInfo.nombreDispositivo,
            'codigoDispositivo':dispositivoInfo.codigoDispositivo,
            'fabricanteDispositivo':dispositivoInfo.fabricanteDispositivo,
        })
    return JsonResponse({
        'dispositivosSistema':dispositivosSistema
    })

def crearDispositivo(request):
    if request.method == 'POST':
        datos = json.load(request)
        nombreDispositivo = datos.get('nombreDispositivo')
        codigoDispositivo = datos.get('codigoDispositivo')
        fabricanteDispositivo = datos.get('fabricanteDispositivo')
        dispositivoSistema.objects.create(
            nombreDispositivo=nombreDispositivo,
            codigoDispositivo=codigoDispositivo,
            fabricanteDispositivo=fabricanteDispositivo,
        )
        return JsonResponse({
            'resp':'ok'
        })

def crearRegistro(request):
    if request.method == 'POST':
        registros = json.load(request)
        registroActual = registroSistema.objects.create()
        codigoRegistro = str(registroActual.id)
        while len(codigoRegistro) < 4:
            codigoRegistro = '0' + codigoRegistro
        codigoRegistro = 'REG-' + codigoRegistro
        registroActual.codigoRegistro = codigoRegistro
        registroActual.save()
        for registro in registros:
            datoSistema.objects.create(
                valorDato=str(registro),
                registroDato=registroActual
            )
        return JsonResponse({
            'resp':'ok'
        })
    
def consultarRegistros(request):
    registrosTotales = registroSistema.objects.all().order_by('id')
    registrosSistema = []
    for registroInfo in registrosTotales:
        registrosSistema.append({
            'id':registroInfo.id,
            'codigoRegistro':registroInfo.codigoRegistro,
        })
    return JsonResponse({
        'registrosSistema':registrosSistema
    })

def conseguirDatos(request,idRegistro):
    registroInfo = registroSistema.objects.get(id=idRegistro)
    valoresTotales = registroInfo.datosistema_set.all()
    arregloValores = []
    for valorInfo in valoresTotales:
        arregloValores.append(valorInfo.valorDato)
    return JsonResponse({
        'arregloValores':arregloValores
    })