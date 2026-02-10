# screening_project-2026--WEB-BASED-APPLICATION-
🚀 Chemical Equipment Parameter Visualizer
Hybrid Web + Desktop Application

A full-stack hybrid system that analyzes and visualizes chemical equipment data using a unified Django backend, React web frontend, and PyQt5 desktop application.

📌 1. Project Overview

This application allows users to upload CSV files containing chemical equipment parameters:

Equipment Name

Equipment Type

Flowrate

Pressure

Temperature

The Django backend processes the data using Pandas, calculates summary statistics, stores upload history, and exposes REST APIs.

Both:

🌐 React Web Application

🖥 PyQt5 Desktop Application

consume the same backend API.

🏗 2. Architecture
Frontend (Web)     → React + Chart.js
Frontend (Desktop) → PyQt5 + Matplotlib
Backend API        → Django + Django REST Framework
Data Processing    → Pandas
Database           → SQLite
Authentication     → Token-based Auth

✨ 3. Features
🔹 Core Features

CSV Upload (Web + Desktop)

Data Parsing using Pandas

Summary Statistics:

Total Equipment Count

Average Flowrate

Average Pressure

Average Temperature

Equipment Type Distribution

Store Last 5 Uploads

RESTful API Architecture

🔹 Visualization Features

📊 Bar Charts (Performance Metrics)

🥧 Pie Charts (Equipment Type Distribution)

📈 Trend Over Time (Historical Data)

Animated Charts (Web)

Matplotlib Visualizations (Desktop)

🔹 Advanced Features

Anomaly Detection Alerts

Compare Last Two Uploads

History Filtering

Export History (CSV / JSON)

Professional PDF Report Generation

Dark / Light Mode Toggle

Enterprise UI Layout

Desktop Application Version

📂 4. Project Structure
screening_project/
│
├── backend/
│   ├── backend/
│   ├── equipment/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── desktop_app/
│   └── desktop_app.py
│
├── sample_equipment_data.csv
└── README.md

⚙ 5. Installation & Setup
🖥 Backend Setup (Django)
Step 1: Create Virtual Environment
python -m venv venv
venv\Scripts\activate

Step 2: Install Dependencies

If you have requirements.txt:

pip install -r requirements.txt


Otherwise install manually:

pip install django djangorestframework django-cors-headers pandas python-dotenv

Step 3: Apply Migrations
python manage.py migrate

Step 4: Create Admin User
python manage.py createsuperuser

Step 5: Run Backend
python manage.py runserver


Backend runs at:

http://127.0.0.1:8000/

🌐 Frontend Setup (React)

Go to frontend folder:

cd frontend


Install dependencies:

npm install


Run:

npm start


Frontend runs at:

http://localhost:3000/

🖥 Desktop Application Setup
cd desktop_app
python desktop_app.py


⚠ Backend server must be running first.

🔐 6. Authentication

Token-based authentication is used.

Login API:

POST /api/auth/login/


Use token in header:

Authorization: Token <your_token>

🌐 7. API Endpoints
Endpoint	Method	Description
/api/upload/	POST	Upload CSV
/api/history/	GET	Fetch upload history
/api/clear-history/	DELETE	Clear history
/api/export/csv/	GET	Export history as CSV
/api/export/json/	GET	Export history as JSON
📈 8. Example CSV Format
Equipment Name,Type,Flowrate,Pressure,Temperature
Pump A,Pump,120,5,80
Valve B,Valve,95,4,70
Compressor C,Compressor,200,8,120

🎨 9. UI Highlights

Enterprise Sidebar Layout

Animated Dashboard

Real-time Trend Visualization

Smart Alerts System

Professional Data Table

Fully Responsive Design

Desktop Software Interface

🧠 10. Technical Skills Demonstrated

REST API Development

Data Analytics with Pandas

React State Management

Token Authentication

Hybrid Architecture (Web + Desktop)

Professional UI Engineering

Report Generation Systems

📦 11. Technologies Used
Backend

Python

Django

Django REST Framework

Pandas

SQLite

Frontend

React.js

Axios

Chart.js

Bootstrap

Framer Motion

Desktop

PyQt5

Matplotlib

Requests

🚀 12. Deployment (Optional)

Backend:

Render

Railway

Frontend:

Vercel

Netlify

Desktop:

Convert to .exe using PyInstaller

🎥 13. Demo Video Script (2–3 Minutes)

You can use this for submission:

Introduce the project and architecture.

Show CSV upload.

Show summary and charts.

Show trend over time.

Demonstrate anomaly detection.

Compare last two uploads.

Generate PDF report.

Switch to desktop application.

Show same data processing in desktop version.

💼 14. Resume Description

Built a hybrid Web + Desktop application using Django REST, React, and PyQt5 to analyze chemical equipment data with visualization, anomaly detection, PDF reporting, and enterprise UI design.

🔗 15. LinkedIn Project Description

Developed a full-stack hybrid analytics platform that processes chemical equipment datasets using Django REST APIs and visualizes performance metrics via React (Web) and PyQt5 (Desktop). Implemented anomaly detection, trend analysis, and exportable PDF reports with a modern enterprise UI.

🔮 16. Future Enhancements

Role-Based Access Control

Predictive Maintenance Analytics

Real-Time Monitoring (WebSockets)

Multi-page Corporate PDF Reports

Docker Containerization

Cloud Deployment

👨‍💻 Author

Sai Krishna Derangula
GitHub: https://github.com/saikrishnaderangula

⭐ Final Note

This project demonstrates strong full-stack engineering capability, data analytics, API integration, UI/UX design, and hybrid software architecture.
