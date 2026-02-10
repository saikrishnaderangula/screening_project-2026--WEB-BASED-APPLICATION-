from django.contrib import admin
from .models import Dataset

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('id', 'total_equipment', 'avg_flowrate', 'avg_pressure', 'avg_temperature', 'uploaded_at')
