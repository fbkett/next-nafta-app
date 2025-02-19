from django.shortcuts import render
from .models import Promocion

def index(request):
    promociones = Promocion.objects.all()
    return render(request, 'promociones/index.html', {
        'promociones': promociones
    }) 