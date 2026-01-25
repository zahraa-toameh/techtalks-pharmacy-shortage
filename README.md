# Pharmacy Shortage Prediction Engine

## Short Description
A Python-based machine learning system that predicts medication shortages before they occur. This helps pharmacies plan inventory, reduce patient stress, and improve supply chain efficiency.

## Problem It Solves
Medication shortages cause delays, stress, and inefficiency. This system predicts shortages in advance so pharmacies can restock and patients can get their medications on time.

## Main Features
- Upload pharmacy data (CSV/API)  
- Track historical demand and supply patterns  
- Predict medication shortages using ML models  
- Dashboard with alerts for upcoming shortages  
- REST API for integration with other systems  

## Tech Stack
- **Backend:** Python, FastAPI  
- **Database:** PostgreSQL  
- **Machine Learning:** Pandas, NumPy, Scikit-learn, XGBoost  
- **Visualization:** Matplotlib, Seaborn / Streamlit  
- **DevOps:** Docker, GitHub Actions  

## Installation

```bash
git clone <your-repo-link>
cd techtalks-pharmacy-shortage
pip install -r requirements.txt


## Setup
# Using Docker (recommended)
docker-compose up


## Folder Structure
techtalks-pharmacy-shortage/
│
├── app/
│   ├── api/          # API endpoints
│   ├── services/     # Business logic
│   ├── models/       # Database and ML models
│   ├── database/     # DB connection
│   ├── ml/           # ML scripts & notebooks
│   └── utils/        # Helper functions
│
├── tests/            # Unit & integration tests
├── notebooks/        # Jupyter notebooks
├── docker/           # Docker configs
├── docs/             # Documentation files
├── requirements.txt  # Python dependencies
└── README.md         # Project overview
