# 🖼️ Images & Cloudinary Setup

## 🚀 Comment ça fonctionne en production (Render)

### Flux normal après redéploiement:

1. **Django démarre** en production (`DEBUG=False`)
2. **Cloudinary s'active** automatiquement pour les **nuevelles images**
3. **Les images téléchargées** vont directement à Cloudinary
4. **Les anciennes images** : fallback vers le dossier local (disparaîtront au prochain redéploiement)

---

## ✅ Checklist pour la production

- [ ] **Variables Cloudinary définies sur Render** :
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- [ ] **DEBUG=False** sur Render (pour activer Cloudinary)

- [ ] **Redéploiement effectué** (pour prendre en compte les modifications)

- [ ] **Tester l'upload d'une nouvelle image** (doit aller à Cloudinary)

---

## 📋 Étapes pour migrer les renciennees images vers Cloudinary

Si vous voulez que les **images existantes** aussi fonctionnent en prod:

### Locale (développement):

```bash
# 1. Assurez-vous que vous pouvez accéder à Cloudinary localement
# 2. Exécutez le script de migration
python manage.py shell < migrate_to_cloudinary.py

# 3. Vérifiez que les images sont maintenant sur Cloudinary
python manage.py shell
>>> from products.models import Product
>>> p = Product.objects.first()
>>> p.image.url  # Doit commencer par https://res.cloudinary.com/
```

### En production (Render):

```bash
# 1. SSH dans Render:
render exec -s YOUR_SERVICE_ID /bin/bash

# 2. Exécutez la migration:
python manage.py shell < migrate_to_cloudinary.py

# Ou manuellement:
python manage.py shell
>>> exec(open('migrate_to_cloudinary.py').read())
```

---

## 🔍 Dépannage

### Les images affichent une URL locale (`/media/...`) en production:

✅ **C'est normal** pendant la transition. Cela signifie:

- L'image existe localement mais pas encore sur Cloudinary
- Vous devez exécuter le script de migration

### Les images retournent 404 en production:

❌ **Vérifiez** :

1. Les variables Cloudinary sont-elles définies ? (`settings > Environment`)
2. DEBUG=False ?
3. L'API Key Cloudinary est-elle correcte ?

### Le upload d'une nouvelle image échoue:

❌ **Vérifiez** que Cloudinary est configuré:

```bash
# Sur Render, vérifiez les logs:
render logs YOUR_SERVICE_ID
# Cherchez des erreurs Cloudinary
```

---

## 🔐 Sécurité

- Les images locales sont servies via `MediaServeView` qui:
  - Vérifie la sécurité du chemin (prévient path traversal)
  - Log les erreurs
  - Ne sert que ce qui est dans `/media/`

---

## 📊 Architecture après deployment

```
Utilisateur
    │
    ├─ Upload nouvelle image
    │  └─ Va directement à Cloudinary ✅
    │
    └─ Demande image existante
       ├─ Si sur Cloudinary → retourne URL Cloudinary ✅
       └─ Si pas encore migrée → fallback local (404 en prod)
```

---

## ⚡ Prochaines étapes recommandées

1. ✅ **Redéployer** le code avec les modifications
2. ✅ **Tester** l'upload d'une nouvelle image
3. ✅ **Migrer** les images existantes vers Cloudinary
4. ✅ **Supprimer** le dossier `/media/` de Render une fois terminé (optionnel)
