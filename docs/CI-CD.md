# 🚀 CI/CD Pipeline Documentation

## Vue d'ensemble

Ce projet utilise un pipeline CI/CD complet avec GitHub Actions et pre-commit hooks pour assurer la qualité du code.

## 📋 Workflows GitHub Actions

### 🔧 Backend Workflows

| Workflow | Déclencheur | Description |
|----------|-------------|-------------|
| `linting.yml` | Push/PR sur `backend/` | Formatage (Black), linting (Flake8), types (MyPy) |
| `coverage.yml` | Push/PR sur `backend/` | Tests unitaires avec couverture |
| `check-python-files.yml` | Push/PR sur `backend/` | Sécurité (Bandit, Safety), code mort (Vulture) |
| `version-check.yml` | Push/PR sur `main` | Vérification incrémentation de version |

### 🌐 Frontend Workflows

| Workflow | Déclencheur | Description |
|----------|-------------|-------------|
| `frontend-ci.yml` | Push/PR sur `frontend/` | ESLint, Prettier, TypeScript, Build |

### 🚀 Workflows Globaux

| Workflow | Déclencheur | Description |
|----------|-------------|-------------|
| `full-ci.yml` | Push/PR sur `main` | Orchestration intelligente backend + frontend |
| `lint-commits.yml` | PR uniquement | Vérification format des commits |

## 🛠️ Configuration Pre-commit

### Installation rapide
```bash
# Exécuter le script d'installation
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

### Installation manuelle
```bash
# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirement-dev.txt

# Frontend
cd frontend
pnpm install
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-react-refresh prettier

# Pre-commit
pip install pre-commit
pre-commit install
pre-commit install --hook-type commit-msg
```

## 🔍 Hooks Pre-commit

### Hooks Généraux
- ✅ Suppression espaces en fin de ligne
- ✅ Ajout retour à la ligne en fin de fichier
- ✅ Validation YAML/JSON/TOML
- ✅ Détection conflits de merge
- ✅ Limitation taille fichiers (1MB)

### Hooks Backend (Python)
- ✅ **Black** - Formatage automatique
- ✅ **reorder-python-imports** - Ordre des imports
- ✅ **Flake8** - Linting
- ✅ **MyPy** - Vérification types
- ✅ **Bandit** - Sécurité
- ✅ **detect-secrets** - Détection secrets

### Hooks Frontend (TypeScript/React)
- ✅ **ESLint** - Linting JavaScript/TypeScript
- ✅ **Prettier** - Formatage code
- ✅ **Commitizen** - Format des commits

## 📝 Format des Commits

Utiliser la convention **Conventional Commits** :

```
type(scope): description

Types autorisés:
- feat: nouvelle fonctionnalité
- fix: correction de bug
- docs: documentation
- style: formatage
- refactor: refactoring
- test: tests
- chore: maintenance
- perf: performance
- ci: CI/CD
- build: build
- revert: annulation
```

### Exemples
```bash
git commit -m "feat(auth): add user authentication"
git commit -m "fix(api): resolve database connection issue"
git commit -m "docs: update API documentation"
```

## 🧪 Tests

### Backend
```bash
cd backend
source .venv/bin/activate

# Lancer tous les tests
pytest

# Tests avec couverture
pytest --cov=core --cov-report=html

# Tests spécifiques
pytest tests/test_sample.py
```

### Frontend
```bash
cd frontend

# Linter
pnpm lint

# Formater
pnpm format

# Build
pnpm build
```

## 🔧 Commandes Utiles

### Pre-commit
```bash
# Exécuter tous les hooks
pre-commit run --all-files

# Exécuter un hook spécifique
pre-commit run black
pre-commit run eslint

# Mettre à jour les hooks
pre-commit autoupdate

# Bypass temporairement (à éviter)
git commit --no-verify
```

### Debugging
```bash
# Voir les logs détaillés
pre-commit run --verbose --all-files

# Nettoyer le cache
pre-commit clean
```

## 🚨 Résolution de Problèmes

### Échec du workflow de version
1. Vérifier que `backend/core/__init__.py` contient `__version__ = "x.y.z"`
2. Créer un tag git : `git tag v0.0.1 && git push --tags`

### Échec des tests de couverture
1. Vérifier que des tests existent dans `backend/tests/`
2. Configurer Codecov avec un token dans les secrets GitHub

### Échec ESLint/Prettier
1. Installer les dépendances : `cd frontend && pnpm install`
2. Vérifier la configuration dans `.eslintrc.js` et `.prettierrc`

## 📊 Intégrations

### Codecov
Ajouter le token Codecov dans les secrets GitHub :
- Nom : `CODECOV_TOKEN`
- Valeur : votre token Codecov

### Badges
Ajouter dans votre README :
```markdown
![CI](https://github.com/username/repo/workflows/Full%20CI%20Pipeline/badge.svg)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

## 🎯 Bonnes Pratiques

1. **Toujours** exécuter pre-commit avant de push
2. **Écrire des tests** pour chaque nouvelle fonctionnalité
3. **Respecter** le format des commits
4. **Incrémenter** la version pour chaque release
5. **Résoudre** tous les warnings de linting

---

💡 **Tip** : Utilisez `./scripts/setup-dev.sh` pour une configuration rapide !
