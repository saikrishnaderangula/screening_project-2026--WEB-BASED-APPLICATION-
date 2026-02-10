import sys
import csv
import json
import requests
import tempfile
import datetime

from PyQt5.QtWidgets import (
    QApplication, QWidget, QPushButton, QLabel, QVBoxLayout, QHBoxLayout,
    QFileDialog, QMessageBox, QTableWidget, QTableWidgetItem, QGroupBox, QMenu
)
from PyQt5.QtCore import Qt

from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas as pdf_canvas


API_UPLOAD = "http://127.0.0.1:8000/api/upload/"
API_HISTORY = "http://127.0.0.1:8000/api/history/"
API_CLEAR = "http://127.0.0.1:8000/api/clear-history/"
TOKEN = "82cc344300c1bec7f0bbccfbf6b5b0c547b5ca7c"


class Canvas(FigureCanvas):
    def __init__(self):
        fig = Figure(figsize=(5, 4))
        self.ax = fig.add_subplot(111)
        super().__init__(fig)


class App(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Parameter Visualizer")
        self.resize(1200, 820)
        self.setStyleSheet(self.styles())

        main_layout = QVBoxLayout(self)

        header = QLabel("Chemical Equipment Parameter Visualizer")
        header.setAlignment(Qt.AlignCenter)
        header.setObjectName("header")
        main_layout.addWidget(header)

        # Toolbar
        toolbar = QHBoxLayout()
        self.upload_btn = QPushButton("Upload CSV")
        self.export_btn = QPushButton("Export ▼")
        self.clear_btn = QPushButton("Clear History")
        toolbar.addWidget(self.upload_btn)
        toolbar.addWidget(self.export_btn)
        toolbar.addWidget(self.clear_btn)
        main_layout.addLayout(toolbar)

        self.upload_btn.clicked.connect(self.upload_csv)
        self.clear_btn.clicked.connect(self.clear_history)

        # Export menu
        self.export_menu = QMenu(self)
        self.export_menu.addAction("Export CSV", self.export_csv)
        self.export_menu.addAction("Export JSON", self.export_json)
        self.export_menu.addAction("Export PDF Report", self.export_pdf)
        self.export_btn.setMenu(self.export_menu)

        # Summary
        self.summary_label = QLabel("Upload CSV to start analysis")
        summary_group = QGroupBox("Dataset Summary")
        QVBoxLayout(summary_group).addWidget(self.summary_label)
        main_layout.addWidget(summary_group)

        # Charts row
        charts_row = QHBoxLayout()
        self.bar_canvas = Canvas()
        self.pie_canvas = Canvas()
        charts_row.addWidget(self.bar_canvas)
        charts_row.addWidget(self.pie_canvas)
        main_layout.addLayout(charts_row)

        # Trend
        self.trend_canvas = Canvas()
        trend_group = QGroupBox("Trend Over Time")
        QVBoxLayout(trend_group).addWidget(self.trend_canvas)
        main_layout.addWidget(trend_group)

        # History table
        self.history_table = QTableWidget()
        history_group = QGroupBox("Upload History")
        QVBoxLayout(history_group).addWidget(self.history_table)
        main_layout.addWidget(history_group)

        self.load_history()

    def styles(self):
        return """
        QWidget { background:#f4f6f8; font-family:Segoe UI; font-size:14px; }
        #header { font-size:22px; font-weight:bold; padding:12px; color:#2f3640; }
        QPushButton { background:#2980b9; color:white; padding:8px; border-radius:5px; }
        QPushButton:hover { background:#1c5980; }
        QGroupBox { border:2px solid #dfe6e9; border-radius:8px; margin-top:10px; padding:10px; }
        QTableWidget { background:white; }
        """

    # -------- Upload --------
    def upload_csv(self):
        path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv)")
        if not path:
            return

        headers = {"Authorization": f"Token {TOKEN}"}
        with open(path, "rb") as f:
            res = requests.post(API_UPLOAD, files={"file": f}, headers=headers)

        if res.status_code == 200:
            data = res.json()
            self.summary_label.setText(
                f"Total: {data['total_equipment']} | Flow: {data['avg_flowrate']} | "
                f"Pressure: {data['avg_pressure']} | Temp: {data['avg_temperature']}"
            )
            self.plot_bar(data)
            self.plot_pie(data)
            self.load_history()
        else:
            QMessageBox.critical(self, "Upload Failed", res.text)

    # -------- Charts --------
    def plot_bar(self, d):
        self.bar_canvas.ax.clear()
        self.bar_canvas.ax.bar(["Flow", "Pressure", "Temp"],
                               [d["avg_flowrate"], d["avg_pressure"], d["avg_temperature"]])
        self.bar_canvas.draw()

    def plot_pie(self, d):
        if "type_distribution" not in d:
            return
        self.pie_canvas.ax.clear()
        self.pie_canvas.ax.pie(d["type_distribution"].values(),
                               labels=d["type_distribution"].keys(),
                               autopct="%1.1f%%")
        self.pie_canvas.draw()

    def plot_trend(self, history):
        self.trend_canvas.ax.clear()
        self.trend_canvas.ax.plot([h["avg_flowrate"] for h in history], label="Flow")
        self.trend_canvas.ax.plot([h["avg_pressure"] for h in history], label="Pressure")
        self.trend_canvas.ax.plot([h["avg_temperature"] for h in history], label="Temp")
        self.trend_canvas.ax.legend()
        self.trend_canvas.draw()

    # -------- History --------
    def load_history(self):
        res = requests.get(API_HISTORY, headers={"Authorization": f"Token {TOKEN}"})
        if res.status_code != 200:
            return
        history = res.json()
        self.history_table.setRowCount(len(history))
        self.history_table.setColumnCount(5)
        self.history_table.setHorizontalHeaderLabels(["Date","Total","Flow","Pressure","Temp"])
        for r, h in enumerate(history):
            self.history_table.setItem(r,0,QTableWidgetItem(h["uploaded_at"]))
            self.history_table.setItem(r,1,QTableWidgetItem(str(h["total_equipment"])))
            self.history_table.setItem(r,2,QTableWidgetItem(str(h["avg_flowrate"])))
            self.history_table.setItem(r,3,QTableWidgetItem(str(h["avg_pressure"])))
            self.history_table.setItem(r,4,QTableWidgetItem(str(h["avg_temperature"])))
        self.plot_trend(history)

    def clear_history(self):
        requests.delete(API_CLEAR, headers={"Authorization": f"Token {TOKEN}"})
        self.history_table.setRowCount(0)
        self.trend_canvas.ax.clear()
        self.trend_canvas.draw()

    # -------- Export CSV / JSON --------
    def export_csv(self):
        history = requests.get(API_HISTORY, headers={"Authorization": f"Token {TOKEN}"}).json()
        path,_ = QFileDialog.getSaveFileName(self,"Save CSV","","CSV Files (*.csv)")
        if not path: return
        with open(path,"w",newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Date","Total","Flow","Pressure","Temp"])
            for h in history:
                writer.writerow([h["uploaded_at"],h["total_equipment"],h["avg_flowrate"],h["avg_pressure"],h["avg_temperature"]])

    def export_json(self):
        history = requests.get(API_HISTORY, headers={"Authorization": f"Token {TOKEN}"}).json()
        path,_ = QFileDialog.getSaveFileName(self,"Save JSON","","JSON Files (*.json)")
        if not path: return
        with open(path,"w") as f:
            json.dump(history,f,indent=4)

    # -------- Professional 2-Page PDF --------
    def export_pdf(self):
        history = requests.get(API_HISTORY, headers={"Authorization": f"Token {TOKEN}"}).json()
        path,_ = QFileDialog.getSaveFileName(self,"Save PDF","","PDF Files (*.pdf)")
        if not path: return

        c = pdf_canvas.Canvas(path, pagesize=letter)
        width, height = letter

        # Save charts
        tmp_bar = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        tmp_pie = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        tmp_trend = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        self.bar_canvas.figure.savefig(tmp_bar.name)
        self.pie_canvas.figure.savefig(tmp_pie.name)
        self.trend_canvas.figure.savefig(tmp_trend.name)

        # Page 1
        c.setFont("Helvetica-Bold",20)
        c.drawCentredString(width/2,height-40,"Chemical Equipment Analysis Report")
        c.setFont("Helvetica",11)
        c.drawCentredString(width/2,height-65,f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")

        c.setFont("Helvetica-Bold",14)
        c.drawString(40,height-100,"Executive Summary")
        c.setFont("Helvetica",12)
        c.drawString(40,height-120,self.summary_label.text())

        c.drawImage(tmp_bar.name,40,height-350,width=250,height=180)
        c.drawImage(tmp_pie.name,330,height-350,width=250,height=180)

        c.setFont("Helvetica-Oblique",9)
        c.drawCentredString(width/2,20,"From Chemical Equipment Visualizer")
        c.showPage()

        # Page 2
        c.setFont("Helvetica-Bold",14)
        c.drawString(40,height-40,"Trend Analysis Over Time")
        c.drawImage(tmp_trend.name,40,height-320,width=500,height=200)

        c.setFont("Helvetica-Bold",12)
        c.drawString(40,height-350,"Upload History")

        c.setFont("Helvetica",9)
        y = height-370
        for h in history[:12]:
            c.drawString(40,y,f"{h['uploaded_at'][:16]} | {h['total_equipment']} | {h['avg_flowrate']} | {h['avg_pressure']} | {h['avg_temperature']}")
            y -= 14

        c.setFont("Helvetica-Oblique",9)
        c.drawCentredString(width/2,20,"From Chemical Equipment Visualizer")
        c.save()

        QMessageBox.information(self,"Success","Professional PDF generated.")
        

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = App()
    window.show()
    sys.exit(app.exec_())

