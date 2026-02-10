from django.db import models

class Dataset(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='csv_files/')
    total_equipment = models.IntegerField()
    avg_flowrate = models.FloatField()
    avg_pressure = models.FloatField()
    avg_temperature = models.FloatField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Dataset {self.id} - {self.uploaded_at}"
