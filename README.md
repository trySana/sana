# 🩺 Sana - Assistant de Santé Intelligent

[![CI](https://github.com/trySana/sana/workflows/Full%20CI%20Pipeline/badge.svg)](https://github.com/trySana/sana/actions)
[![codecov](https://codecov.io/gh/trySana/sana/branch/main/graph/badge.svg)](https://codecov.io/gh/trySana/sana)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-blue.svg)](https://python.org)
[![React Native](https://img.shields.io/badge/react--native-0.79-blue.svg)](https://reactnative.dev)

> **Sana** est une application mobile intelligente qui fournit des conseils de santé personnalisés en utilisant l'intelligence artificielle. L'application analyse les symptômes décrits par l'utilisateur et propose des recommandations de santé adaptées.

## 🌟 Fonctionnalités Principales

### 🤖 Intelligence Artificielle
- **Analyse de symptômes** : Reconnaissance et classification automatique des symptômes
- **Conseils personnalisés** : Recommandations de santé basées sur l'IA (OpenAI)
- **Synthèse vocale** : Conversion text-to-speech avec Coqui TTS pour l'accessibilité

### 📱 Interface Utilisateur
- **Application mobile** : Interface React Native moderne et intuitive
- **Expérience utilisateur** : Design responsive et accessible
- **Historique médical** : Suivi des consultations et symptômes

### 🔒 Sécurité & Données
- **Authentification sécurisée** : Gestion des utilisateurs avec mots de passe chiffrés
- **Base de données** : Stockage sécurisé avec MongoDB
- **Historique médical** : Suivi des symptômes et consultations

## 🏗️ Architecture

### Backend (FastAPI)
```
backend/
├── core/
│   ├── models/          # Modèles de données (User, MedicalHistory)
│   ├── utils/           # Utilitaires (symptômes, TTS, connexion)
│   ├── config.py        # Configuration et variables d'environnement
│   └── database.py      # Configuration MongoDB
├── main.py              # Point d'entrée de l'API
├── requirements.txt     # Dépendances Python
└── Dockerfile          # Configuration Docker
```

### Frontend (React Native + Expo)
```
frontend/
├── components/         # Composants React Native
├── App.tsx            # Application principale
├── package.json       # Dépendances Node.js
└── tsconfig.json      # Configuration TypeScript
```

## 🚀 Installation et Démarrage

### Prérequis
- Python 3.10+
- Node.js 18+
- MongoDB
- Expo CLI

### 1. Cloner le repository
```bash
git clone https://github.com/trySana/sana.git
cd sana
```

### 2. Configuration Backend
```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API
```

### 3. Variables d'environnement
Créer un fichier `.env` dans le dossier `backend/` :
```env
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=mongodb://localhost:27017
MONGO_DB=sana_db
MONGO_USER=your_mongo_user
MONGO_PWD=your_mongo_password
MONGO_HOST=localhost
```

### 4. Démarrer le Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Configuration Frontend
```bash
cd frontend

# Installer les dépendances
npm install
# ou
pnpm install

# Démarrer l'application
npm start
# ou
pnpm start
```

## 🧪 Tests et Qualité du Code

### Backend
```bash
cd backend

# Lancer les tests
pytest

# Tests avec couverture
pytest --cov=core --cov-report=html

# Linting et formatage
black .
flake8 .
mypy .
```

### Frontend
```bash
cd frontend

# Linting
npm run lint

# Formatage
npm run format

# Vérification TypeScript
npm run type-check
```

## 🔧 Développement

### Pre-commit Hooks
```bash
# Installation automatique
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Installation manuelle
pip install pre-commit
pre-commit install
pre-commit install --hook-type commit-msg
```

### Format des Commits
Utiliser la convention **Conventional Commits** :
```bash
git commit -m "feat(auth): add user authentication"
git commit -m "fix(api): resolve symptom parsing issue"
git commit -m "docs: update API documentation"
```

## 📊 Analyse des Symptômes

L'application peut reconnaître et analyser plus de 12 catégories de symptômes :

- **Généraux** : Fatigue, fièvre, frissons, sueurs nocturnes
- **Neurologiques** : Maux de tête, vertiges, convulsions, tremblements
- **Cardiovasculaires** : Douleurs thoraciques, palpitations, essoufflement
- **Respiratoires** : Toux, respiration sifflante, oppression thoracique
- **Gastro-intestinaux** : Nausées, vomissements, douleurs abdominales
- **Musculo-squelettiques** : Douleurs articulaires, raideurs, crampes
- **Psychiatriques** : Anxiété, dépression, insomnie, sautes d'humeur
- **Et bien d'autres...**

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'feat: add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Documentation

- [Documentation CI/CD](docs/CI-CD.md)
- [Configuration Backend](backend/README.md)
- [API Documentation](http://localhost:8000/docs) (après démarrage du backend)

## 🛡️ Sécurité

- Authentification sécurisée avec hashage des mots de passe
- Validation des données d'entrée
- Protection contre les injections
- Détection automatique des secrets avec pre-commit hooks

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🚨 Avertissement Médical

⚠️ **Important** : Cette application est conçue à des fins éducatives et d'information uniquement. Elle ne remplace pas un avis médical professionnel. Consultez toujours un professionnel de la santé qualifié pour tout problème médical.

## 👥 Équipe

- **Développement** : Équipe trySana
- **Conception** : Interface utilisateur moderne et accessible
- **IA** : Intégration OpenAI pour l'analyse des symptômes

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [issue](https://github.com/trySana/sana/issues)
- Consulter la [documentation](docs/)
- Contacter l'équipe de développement

---

<p align="center">
  Fait avec ❤️ par l'équipe trySana
</p>
