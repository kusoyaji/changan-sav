# 🚗 Changan SAV - Service Après-Vente WhatsApp Flow

> **Enquête de satisfaction client via WhatsApp Business**  
> Projet développé pour Changan Maroc par Voom Digital

---

## 📖 Vue d'ensemble

Ce projet permet de collecter automatiquement les retours clients après un passage au service après-vente Changan via un formulaire WhatsApp Flow interactif.

### ✨ Fonctionnalités

- ✅ **6 questions structurées** pour évaluer la satisfaction
- ✅ **Logique conditionnelle** pour approfondir les réponses négatives
- ✅ **Envoi automatique** du questionnaire via WhatsApp
- ✅ **Stockage sécurisé** des réponses dans une base de données
- ✅ **Interface d'administration** pour consulter les résultats
- ✅ **Déploiement cloud** sur Vercel (gratuit)

---

## 📊 Questionnaire

Le flow comprend **6 questions principales** + **2 questions conditionnelles** :

1. **Accueil et courtoisie** de l'équipe  
   → Si insatisfait : *"Pourquoi ?"*

2. **Respect des délais** annoncés (Oui/Non)

3. **Qualité du service** rendu sur le véhicule  
   → Si insatisfait : *"Pourquoi ?"*

4. **Note de recommandation** (échelle 1-10)

5. **Remarques et suggestions** (optionnel)

6. **Souhait d'être recontacté** (Oui/Non)

**Total : 6 à 8 pages** selon les réponses

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Client WhatsApp │
└────────┬────────┘
         │ Reçoit Flow
         ▼
┌─────────────────┐
│ WhatsApp Flow   │ (whatsapp-sav-flow.json)
│  (8 pages)      │
└────────┬────────┘
         │ Soumet données
         ▼
┌─────────────────┐
│ Webhook Server  │ (webhook-server.js sur Vercel)
│  Port 3001      │
└────────┬────────┘
         │ Sauvegarde
         ▼
┌─────────────────┐
│ Upstash Redis   │ (Base de données séparée)
│  Database       │
└─────────────────┘
```

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ installé
- Compte Vercel (gratuit)
- Compte Upstash (gratuit)
- Accès à l'application Voom Digital sur Facebook Developers

### Installation

```bash
# 1. Naviguer vers le dossier
cd changan-sav

# 2. Installer les dépendances
npm install

# 3. Générer les clés de chiffrement
node ../generate-keys.js

# 4. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 5. Démarrer le serveur local
npm start
```

Le serveur démarre sur `http://localhost:3001`

### Test rapide

```bash
# Envoyer un questionnaire de test
node test-sav-flow.js +212600000000 "Ahmed"
```

---

## 📁 Structure du projet

```
changan-sav/
├── whatsapp-sav-flow.json      # Définition du flow (8 pages)
├── webhook-server.js           # Serveur webhook principal
├── test-sav-flow.js           # Script de test
├── package.json               # Dépendances
├── vercel.json                # Configuration Vercel
├── .env.example               # Template variables d'environnement
│
├── README.md                  # Ce fichier
├── DEPLOYMENT-GUIDE.md        # Guide de déploiement complet
├── DATABASE-SETUP.md          # Configuration base de données
├── TESTING-GUIDE.md           # Guide de test
└── QUICK-REFERENCE.md         # Référence rapide
```

---

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` :

```env
# WhatsApp Business (Voom Digital)
WHATSAPP_ACCESS_TOKEN=EAFgpN5lxPgUBOT9y6Uo9N0KA5rZBMYYDVvbBnHzBSBey430X1nx8f2HNrtM9C9qI4JyZAnhlcX06YpsZAjQPZBiZBdPiWorxIcIitKioGxFbPlkGvysNLnfjKNsaIULIq3u0CNpKN70ZCUZAHIMZCpUbmHOf7SkUH55b2KeyEEZCQMZAqAgQSy5G5KBJXvXjVxQAZDZD
PHONE_NUMBER_ID=978792171974983

# Flow ID (obtenu après création du flow)
SAV_FLOW_ID=VOTRE_FLOW_ID_ICI

# Webhook
WHATSAPP_VERIFY_TOKEN=changan_sav_webhook_verify_2026_secure

# Clés de chiffrement (générées via generate-keys.js)
CHANGAN_PRIVATE_KEY=-----BEGIN ENCRYPTED PRIVATE KEY-----...
CHANGAN_PASSPHRASE=votre_passphrase

# Base de données Upstash Redis
CHANGAN_KV_REST_API_URL=https://xxxxx.upstash.io
CHANGAN_KV_REST_API_TOKEN=votre_token
```

---

## 🌐 Déploiement

### Sur Vercel

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Déployer
vercel --prod

# 4. Configurer les variables d'environnement dans Vercel Dashboard
```

**URL de production** : `https://changan-sav.vercel.app` (ou votre URL)

### Configuration WhatsApp

1. **Créer le Flow** sur WhatsApp Manager
2. **Uploader** `whatsapp-sav-flow.json`
3. **Configurer l'endpoint** : `https://votre-url.vercel.app/flow`
4. **Uploader la clé publique** de chiffrement
5. **Publier le Flow**

6. **Configurer le Webhook** dans Facebook Developers
   - URL : `https://votre-url.vercel.app/webhook`
   - Token : `changan_sav_webhook_verify_2026_secure`

📚 **Guide détaillé** : [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

---

## 🧪 Tests

### Tests locaux

```bash
# Test 1 : Vérifier le serveur
curl http://localhost:3001/

# Test 2 : Envoyer un questionnaire
node test-sav-flow.js +212600123456 "Test User"

# Test 3 : Consulter les réponses
curl http://localhost:3001/admin/surveys
```

### Tests en production

```bash
# Vérifier le déploiement
curl https://votre-url.vercel.app/

# Consulter les logs
vercel logs
```

📚 **Guide complet** : [TESTING-GUIDE.md](TESTING-GUIDE.md)

---

## 📊 Administration

### Consulter les réponses

**Interface admin** : `https://votre-url.vercel.app/admin/surveys`

**API** :
```bash
curl https://votre-url.vercel.app/admin/surveys
```

Réponse :
```json
{
  "total": 15,
  "surveys": [
    {
      "data": {
        "accueil_courtoisie": "tres_satisfaisant",
        "delais_respectes": "oui",
        "qualite_service": "satisfaisant",
        "note_recommandation": "9",
        "remarques": "Très bon service",
        "recontact": "non"
      },
      "submitted_at": "2026-02-02T14:30:00.000Z"
    }
  ]
}
```

### Envoyer manuellement un questionnaire

**API** :
```bash
curl -X POST https://votre-url.vercel.app/api/send-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212600000000",
    "name": "Ahmed"
  }'
```

---

## 🔐 Sécurité

- ✅ **Chiffrement end-to-end** des données du flow
- ✅ **HTTPS obligatoire** (géré par Vercel)
- ✅ **Variables d'environnement** sécurisées
- ✅ **Tokens d'accès** rotatifs
- ✅ **Base de données isolée** (séparée des autres projets)

---

## 📈 Monitoring

### Métriques clés

- **Taux de réponse** : % de questionnaires complétés
- **Note moyenne** : Score NPS (1-10)
- **Satisfaction globale** : % très satisfait/satisfait
- **Points d'amélioration** : Analyse des réponses "pourquoi"

### Outils

- **Vercel Analytics** : Performance et uptime
- **Upstash Console** : Utilisation base de données
- **Logs** : `vercel logs --follow`

---

## 🆘 Support

### Documentation

- 📘 [README.md](README.md) - Ce fichier
- 🚀 [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) - Déploiement complet
- 💾 [DATABASE-SETUP.md](DATABASE-SETUP.md) - Configuration BDD
- 🧪 [TESTING-GUIDE.md](TESTING-GUIDE.md) - Tests
- ⚡ [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Référence rapide

### Problèmes courants

**Le flow ne s'envoie pas ?**
- Vérifier que `SAV_FLOW_ID` est correct
- Vérifier que le Flow est publié sur Facebook
- Vérifier l'access token

**Les données ne se sauvent pas ?**
- Vérifier les credentials Upstash Redis
- Vérifier les variables d'environnement dans Vercel
- Consulter les logs : `vercel logs`

**Erreur de déchiffrement ?**
- Vérifier que la clé publique uploadée correspond à la clé privée
- Vérifier le passphrase

---

## 🔄 Workflow

```
1. Client termine sa visite au SAV
2. Agent envoie le questionnaire via WhatsApp
3. Client reçoit le message avec bouton "Commencer"
4. Client répond aux 6 questions
5. Les réponses sont sauvegardées automatiquement
6. Message de confirmation envoyé au client
7. Admin consulte les résultats dans le dashboard
```

---

## 📝 Notes importantes

- ✅ Ce projet est **séparé** des flows enseignement/prepa
- ✅ Utilise les **mêmes credentials WhatsApp** (Voom Digital)
- ✅ Utilise un **port différent** (3001 vs 3000)
- ✅ Utilise une **base de données séparée**
- ✅ Peut être déployé sur un **projet Vercel distinct**
- ⚠️ Nécessitera l'accès à l'app WhatsApp Business de Changan (en attente)

---

## 🤝 Contribution

Développé par **Voom Digital** pour **Changan Maroc**

### Crédits

- **WhatsApp Business API** : Meta
- **Hébergement** : Vercel
- **Base de données** : Upstash Redis
- **Framework** : Node.js + Express

---

## 📄 Licence

MIT License - Voom Digital © 2026

---

## ✅ Checklist de mise en production

- [ ] Clés de chiffrement générées
- [ ] Flow créé et publié sur WhatsApp Manager
- [ ] Base de données Upstash créée
- [ ] Variables d'environnement configurées
- [ ] Tests locaux réussis
- [ ] Déploiement Vercel effectué
- [ ] Webhook configuré dans Facebook
- [ ] Endpoint du Flow mis à jour
- [ ] Test end-to-end réussi
- [ ] Documentation à jour
- [ ] Formation équipe effectuée

---

## 📞 Contact

Pour toute question ou support :

- **Email** : [votre email]
- **Documentation** : Voir fichiers .md dans ce dossier
- **Logs** : `vercel logs`

---

**🚀 Prêt à déployer !**
