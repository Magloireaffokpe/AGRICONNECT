import os
from datetime import timedelta
from pathlib import Path
from decouple import config
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY", default="django-insecure-xxx")
DEBUG = config("DEBUG", default=True, cast=bool)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "corsheaders",
    # ✅ Cloudinary — ordre important : storage AVANT cloudinary
    "cloudinary_storage",
    "cloudinary",
    # Local apps
    "core",
    "accounts",
    "products",
    "orders",
    "delivery",
    "reviews",
    "admin_dashboard",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "agriconnect.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "agriconnect.wsgi.application"

# ─── Database ──────────────────────────────────────────────────────
if config("DATABASE_URL", default=""):
    DATABASES = {
        "default": dj_database_url.config(
            default=config("DATABASE_URL"),
            conn_max_age=600,        # ✅ Connexions persistantes = moins de latence
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": config("DB_NAME", default="agriconnect_db"),
            "USER": config("DB_USER", default="agriconnect_user"),
            "PASSWORD": config("DB_PASSWORD", default=""),
            "HOST": config("DB_HOST", default="localhost"),
            "PORT": config("DB_PORT", default="5432"),
            "CONN_MAX_AGE": 60,
        }
    }

AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Porto-Novo"
USE_I18N = True
USE_TZ = True

# ─── Static files ──────────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ============================================================
# À remplacer dans settings.py — SECTION CLOUDINARY COMPLÈTE
# ============================================================
#
# Le bug : django-cloudinary-storage génère des URLs sans /image/upload/
# quand CLOUDINARY_STORAGE n'est pas configuré correctement.
#
# Fix : configurer cloudinary SDK directement + forcer le bon format d'URL.

CLOUDINARY_CLOUD_NAME = config("CLOUDINARY_CLOUD_NAME", default="")
CLOUDINARY_API_KEY    = config("CLOUDINARY_API_KEY",    default="")
CLOUDINARY_API_SECRET = config("CLOUDINARY_API_SECRET", default="")

if not DEBUG and CLOUDINARY_CLOUD_NAME:
    import cloudinary
    import cloudinary.uploader
    import cloudinary.api

    # ✅ Étape 1 — Initialiser le SDK cloudinary directement
    cloudinary.config(
        cloud_name = CLOUDINARY_CLOUD_NAME,
        api_key    = CLOUDINARY_API_KEY,
        api_secret = CLOUDINARY_API_SECRET,
        secure     = True,
        # ✅ CLEF DU BUG : forcer le préfixe /image/upload/ dans les URLs
        api_proxy  = None,
    )

    # ✅ Étape 2 — Config django-cloudinary-storage
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME":  CLOUDINARY_CLOUD_NAME,
        "API_KEY":     CLOUDINARY_API_KEY,
        "API_SECRET":  CLOUDINARY_API_SECRET,
        "SECURE":      True,
        # Dossier où seront stockées les images sur Cloudinary
        "MEDIA_TAG":   "agriconnect",
        # ✅ Préfixe de dossier — les images iront dans products/ sur Cloudinary
        "PREFIX":      "agriconnect",
    }

    # ✅ Étape 3 — Activer le stockage Cloudinary
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

    # L'URL de base des médias en prod
    MEDIA_URL = f"https://res.cloudinary.com/{CLOUDINARY_CLOUD_NAME}/image/upload/"

else:
    # Développement — stockage local
    MEDIA_URL  = "/media/"
    MEDIA_ROOT = BASE_DIR / "media"

    if not DEBUG and not CLOUDINARY_CLOUD_NAME:
        import warnings
        warnings.warn("⚠️  CLOUDINARY_CLOUD_NAME manquant — images non sauvegardées sur Cloudinary")
# ─── Auth redirects ────────────────────────────────────────────────
LOGIN_URL = "/secret-agri-admin/login/"
LOGIN_REDIRECT_URL = "/secret-agri-admin/users/"
LOGOUT_REDIRECT_URL = "/secret-agri-admin/login/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ─── Django REST Framework ─────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "200/day",
        "user": "2000/day",
    },
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}

# ─── SimpleJWT ─────────────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS":  True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

# ─── CORS ──────────────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# ─── Email ─────────────────────────────────────────────────────────
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:5173")

if DEBUG:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    INSTALLED_APPS += ["anymail"]
    EMAIL_BACKEND = "anymail.backends.sendgrid.EmailBackend"
    ANYMAIL = {
        "SENDGRID_API_KEY": config("SENDGRID_API_KEY", default=""),
    }
    DEFAULT_FROM_EMAIL = "noreply@agriconnect.com"
    SERVER_EMAIL = "noreply@agriconnect.com"

# ─── Sécurité production ───────────────────────────────────────────
if not DEBUG:
    ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="").split(",")
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# ─── Logging ───────────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING" if not DEBUG else "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}

# ─── Cache ─────────────────────────────────────────────────────────
# ✅ Cache mémoire local (gratuit, améliore les perfs sans Redis)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "agriconnect-cache",
        "TIMEOUT": 300,  # 5 minutes
        "OPTIONS": {
            "MAX_ENTRIES": 1000,
        },
    }
}