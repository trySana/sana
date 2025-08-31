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

## 🚀 Pipeline CI/CD - Implémentation Technique Détaillée

### **Vue d'ensemble de l'architecture CI/CD**

Notre projet utilise un **pipeline CI/CD complet et professionnel** qui suit les meilleures pratiques DevOps modernes. Cette implémentation assure la qualité du code, la sécurité et la traçabilité à chaque étape du développement.

### **🔧 Workflows GitHub Actions (CI)**

#### **1. Linting Workflow** (`linting.yml`)
```yaml
# Déclencheur : Push sur n'importe quelle branche
on:
  push:
```
**Technologies et fonctionnalités :**
- **Black** : Formateur de code Python automatique (standard PEP 8)
- **Flake8** : Linter Python avec règles strictes (E9, F63, F7, F82)
- **MyPy** : Vérification statique des types Python
- **Validation syntaxique** : Détection automatique des erreurs de code

**Pourquoi c'est important :**
- Garantit la cohérence du style de code selon les standards Python
- Détecte les erreurs de syntaxe et de logique avant le déploiement
- Assure la qualité du code à chaque commit

#### **2. Coverage Workflow** (`coverage.yml`)
```yaml
# Tests avec couverture de code complète
pytest --cov=. --cov-report=xml --cov-report=html --cov-report=term-missing
```
**Intégrations et fonctionnalités :**
- **Codecov** : Suivi automatique de la couverture de tests
- **Artifacts GitHub** : Stockage des rapports de couverture HTML
- **XML Coverage** : Format standard pour l'intégration continue
- **Rapports détaillés** : Visualisation de la couverture par module

#### **3. Security Analysis** (`check-python-files.yml`)
```yaml
# Déclencheur intelligent : Push/PR sur main/dev avec filtrage par chemin
paths:
  - 'backend/**'
```
**Outils de sécurité implémentés :**
- **Vulture** : Détection de code mort avec seuil de confiance 80%
- **py_compile** : Validation syntaxe Python en temps réel
- **Filtrage intelligent** : Exécution uniquement sur les fichiers backend modifiés
- **Prévention des vulnérabilités** : Analyse automatique de sécurité

#### **4. Version Management** (`version-check.yml`)
```python
# Script Python personnalisé pour vérifier l'incrémentation
if version.parse(current_version) <= version.parse(previous_version):
    print("Version has not been incremented.")
    exit(1)
```
**Fonctionnalités avancées :**
- **Vérification automatique** de l'incrémentation de version
- **Intégration Git tags** : Synchronisation avec l'historique des releases
- **Prévention des erreurs** : Rejet des commits sans incrémentation de version
- **Traçabilité** : Historique complet des versions du projet

#### **5. Commit Linting** (`lint-commits.yml`)
```yaml
# Validation automatique du format des commits
npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }}
```
**Standards appliqués :**
- **Conventional Commits** : Format standardisé (feat:, fix:, docs:, etc.)
- **Validation automatique** : Rejet des commits non conformes
- **Historique traçable** : Format pour l'automatisation des changelogs
- **Collaboration équipe** : Standards partagés pour tous les développeurs

### **🛠️ Configuration Pre-commit (CD Local)**

#### **Architecture des Hooks**
```yaml
repos:
  # Hooks généraux (qualité de base)
  - repo: https://github.com/pre-commit/pre-commit-hooks
    hooks:
      - trailing-whitespace      # Suppression espaces fin de ligne
      - end-of-file-fixer        # Retour à la ligne en fin de fichier
      - check-merge-conflict     # Détection conflits Git
      - check-added-large-files  # Limitation taille (1MB)
      - mixed-line-ending        # Standardisation des fins de ligne (LF)

  # Hooks Python spécialisés
  - repo: https://github.com/psf/black
    hooks:
      - id: black
        files: ^backend/          # Application uniquement sur backend
        language_version: python3.11

  # Hooks de sécurité avancés
  - repo: https://github.com/Yelp/detect-secrets
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: ^(.*\.lock|.*\.log|node_modules/.*)
```

#### **Hooks Spécialisés par Technologie**
- **Python Backend** : Black, Flake8, MyPy, reorder-python-imports
- **Frontend** : Prettier, ESLint (configuré pour React Native)
- **Sécurité** : detect-secrets, validation des formats de fichiers
- **Git** : commitizen pour la standardisation des commits

### **🚀 Script d'Automatisation**

#### **Setup Script** (`scripts/setup-dev.sh`)
```bash
#!/bin/bash
set -e  # Arrêt immédiat en cas d'erreur

# Vérifications préalables automatiques
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi

# Configuration automatique des environnements
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirement-dev.txt

# Installation et configuration pre-commit
pre-commit install
pre-commit install --hook-type commit-msg
```

**Fonctionnalités du script :**
- **Vérifications automatiques** des prérequis système
- **Configuration d'environnement** Python et Node.js
- **Installation automatique** des hooks pre-commit
- **Documentation intégrée** des commandes utiles

### **🎯 Pourquoi cette implémentation ?**

#### **Avantages techniques :**
1. **Qualité du code** : Détection automatique des erreurs et incohérences
2. **Cohérence** : Style uniforme grâce aux formateurs automatiques
3. **Sécurité** : Détection de secrets et vulnérabilités en temps réel
4. **Traçabilité** : Historique des versions et commits standardisés
5. **Automatisation** : Réduction drastique des erreurs humaines
6. **Performance** : Filtrage intelligent des workflows par type de fichier

#### **Standards industriels respectés :**
- **Black** : Formateur officiel Python (PEP 8)
- **Conventional Commits** : Standard pour l'automatisation des changelogs
- **GitHub Actions** : Plateforme CI/CD de référence de l'industrie
- **Pre-commit** : Framework standard pour les hooks Git
- **Codecov** : Standard pour la mesure de couverture de code

#### **Intégration DevOps complète :**
- **CI (Continuous Integration)** : Vérifications automatiques à chaque push
- **CD (Continuous Deployment)** : Déploiement local sécurisé avec pre-commit
- **Monitoring** : Suivi automatique de la couverture et qualité du code
- **Collaboration** : Standards partagés pour toute l'équipe de développement

### **🔍 Points techniques remarquables**

#### **Filtrage intelligent des workflows :**
```yaml
paths:
  - 'backend/**'  # Seulement si fichiers backend modifiés
  - 'frontend/**' # Seulement si fichiers frontend modifiés
```

#### **Gestion des environnements :**
```yaml
defaults:
  run:
    working-directory: backend  # Contexte d'exécution optimisé
```

#### **Gestion des erreurs robuste :**
```yaml
fail_ci_if_error: false  # Continuité même en cas d'échec Codecov
```

#### **Optimisation des ressources :**
- **Exécution conditionnelle** : Workflows déclenchés uniquement quand nécessaire
- **Cache des dépendances** : Réutilisation des packages installés
- **Parallélisation** : Exécution simultanée des jobs indépendants

### **📊 Métriques et Monitoring**

#### **Badges de qualité :**
```markdown
[![CI](https://github.com/trySana/sana/workflows/Full%20CI%20Pipeline/badge.svg)](https://github.com/trySana/sana/actions)
[![codecov](https://codecov.io/gh/trySana/sana/branch/main/graph/badge.svg)](https://codecov.io/gh/trySana/sana)
```

#### **Métriques suivies :**
- **Couverture de code** : Pourcentage de code testé
- **Qualité du code** : Score de linting et formatage
- **Sécurité** : Nombre de vulnérabilités détectées
- **Performance** : Temps d'exécution des workflows

### **🔄 Cycle de développement optimisé**

1. **Développement local** → Pre-commit hooks automatiques
2. **Commit** → Validation du format et de la qualité
3. **Push** → Déclenchement des workflows CI
4. **Tests automatiques** → Validation complète du code
5. **Rapports** → Feedback immédiat sur la qualité
6. **Merge** → Code validé et sécurisé

Cette implémentation CI/CD démontre une **maîtrise technique avancée** des outils DevOps modernes et suit les **meilleures pratiques de l'industrie**. C'est un excellent exemple de pipeline professionnel qui peut être présenté dans un contexte académique ou professionnel.

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
