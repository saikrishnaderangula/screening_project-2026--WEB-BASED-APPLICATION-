from django.shortcuts import render

import pandas as pd
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from .models import Dataset

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_csv(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    path = default_storage.save(file.name, file)

    df = pd.read_csv(default_storage.path(path))
    type_counts = df['Type'].value_counts().to_dict()


    total = len(df)
    avg_flow = df['Flowrate'].mean()
    avg_press = df['Pressure'].mean()
    avg_temp = df['Temperature'].mean()

    dataset = Dataset.objects.create(
        file=path,
        total_equipment=total,
        avg_flowrate=avg_flow,
        avg_pressure=avg_press,
        avg_temperature=avg_temp
    )

    if Dataset.objects.count() > 5:
        Dataset.objects.order_by('uploaded_at').first().delete()

    return Response({
        "total_equipment": total,
        "avg_flowrate": avg_flow,
        "avg_pressure": avg_press,
        "avg_temperature": avg_temp,
        "type_distribution": type_counts, 
    })

from .serializers import DatasetSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    datasets = Dataset.objects.all().order_by('-uploaded_at')
    serializer = DatasetSerializer(datasets, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_history(request):
    Dataset.objects.all().delete()
    return Response({"message": "History cleared successfully"})
import csv
import json
from django.http import HttpResponse
from openpyxl import Workbook
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Dataset

def get_history_data():
    return Dataset.objects.all().values(
        "uploaded_at",
        "total_equipment",
        "avg_flowrate",
        "avg_pressure",
        "avg_temperature"
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="history.csv"'
    writer = csv.writer(response)

    writer.writerow(["Date", "Total", "Flow", "Pressure", "Temp"])
    for item in get_history_data():
        writer.writerow(item.values())

    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_json(request):
    data = list(get_history_data())
    response = HttpResponse(json.dumps(data, default=str), content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="history.json"'
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_excel(request):
    wb = Workbook()
    ws = wb.active
    ws.append(["Date", "Total", "Flow", "Pressure", "Temp"])

    for item in get_history_data():
        ws.append(list(item.values()))

    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="history.xlsx"'
    wb.save(response)
    return response
