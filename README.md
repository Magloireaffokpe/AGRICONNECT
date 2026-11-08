# 🌾 AgriConnect – Marché Agricole en ligne

AgriConnect connecte directement agriculteurs et acheteurs à Parakou (Bénin).  
Plateforme B2B & B2C pour la vente de produits agricoles frais.

## 🚀 Stack technique

| Backend | Frontend |
|---------|----------|
| Django 6.0 | React 18 + TypeScript |
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
# Créer .env : voir « Installer sur un nouveau PC » ci-dessous
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

<!-- nouveau-pc:debut -->
## Installer sur un nouveau PC

**Prérequis :** Git, Python 3.12 et Node.js 20 ou plus.

```bash
git clone git@github.com:Magloireaffokpe/AGRICONNECT.git
cd AGRICONNECT/Backend
python3 -m venv venv
source venv/bin/activate   # Windows : venv\Scripts\activate
pip install -r requirements.txt
# Créer Backend/.env (voir ci-dessous)
python manage.py migrate
python manage.py runserver

# Dans un autre terminal
cd agriconnect
npm install
# Créer agriconnect/.env (voir ci-dessous)
npm run dev
```

**À recopier à la main (hors Git) :**

- `Backend/.env` : `SECRET_KEY`, `DEBUG`, `FRONTEND_URL`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `agriconnect/.env` : `VITE_API_BASE_URL`, `VITE_APP_NAME`
- `Backend/media/` pour conserver les images locales
<!-- nouveau-pc:fin -->
