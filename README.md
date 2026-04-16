# 🌾 AgriConnect – Marché Agricole en ligne

AgriConnect connecte directement agriculteurs et acheteurs à Parakou (Bénin).  
Plateforme B2B & B2C pour la vente de produits agricoles frais.

## 🚀 Stack technique

| Backend | Frontend |
|---------|----------|
| Django 4.2 | React 18 + TypeScript |
| Django REST Framework | Tailwind CSS + shadcn/ui |
| PostgreSQL / SQLite | React Query + Axios |
| JWT (SimpleJWT) | Framer Motion |
| CORS, django‑filters | React Hook Form + Zod |

## 📦 Installation (développement)

### Backend (Django)

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # éditez avec vos identifiants
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver