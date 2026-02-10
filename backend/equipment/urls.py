from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_csv),
    path('history/', views.history),
    path('clear-history/', views.clear_history),
    path('export/csv/', views.export_csv),
    path('export/json/', views.export_json),
    path('export/excel/', views.export_excel),
]
