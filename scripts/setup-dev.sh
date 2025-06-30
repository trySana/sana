#!/bin/bash

# Script de configuration de l'environnement de développement
# Usage: ./scripts/setup-dev.sh

set -e

echo "🚀 Configuration de l'environnement de développement..."

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installation de pnpm..."
    npm install -g pnpm
fi

echo "🐍 Configuration de l'environnement Python (Backend)..."

# Créer un environnement virtuel Python si il n'existe pas
if [ ! -d "backend/.venv" ]; then
    echo "📦 Création de l'environnement virtuel Python..."
    cd backend
    python3 -m venv .venv
    cd ..
fi

# Activer l'environnement virtuel et installer les dépendances
echo "📦 Installation des dépendances Python..."
cd backend
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirement-dev.txt
cd ..

echo "🌐 Configuration de l'environnement Node.js (Frontend)..."

# Installer les dépendances frontend
echo "📦 Installation des dépendances Node.js..."
cd frontend
pnpm install

# Installer les dépendances ESLint si nécessaire
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-react-refresh prettier

cd ..

echo "🔧 Configuration de pre-commit..."

# Installer pre-commit
pip install pre-commit

# Installer les hooks pre-commit
pre-commit install
pre-commit install --hook-type commit-msg

# Exécuter pre-commit sur tous les fichiers pour initialiser
echo "🧹 Exécution initiale de pre-commit..."
pre-commit run --all-files || true

echo "✅ Configuration terminée!"
echo ""
echo "📋 Commandes utiles:"
echo "  • Backend:"
echo "    - cd backend && source .venv/bin/activate  # Activer l'environnement virtuel"
echo "    - cd backend && python -m pytest          # Lancer les tests"
echo "    - cd backend && black .                    # Formater le code"
echo "    - cd backend && flake8 .                   # Linter le code"
echo ""
echo "  • Frontend:"
echo "    - cd frontend && pnpm dev                  # Démarrer le serveur de dev"
echo "    - cd frontend && pnpm build               # Builder pour la production"
echo "    - cd frontend && pnpm lint                # Linter le code"
echo "    - cd frontend && pnpm format              # Formater le code"
echo ""
echo "  • Pre-commit:"
echo "    - pre-commit run --all-files              # Exécuter tous les hooks"
echo "    - pre-commit run <hook-name>              # Exécuter un hook spécifique"
echo "    - pre-commit autoupdate                   # Mettre à jour les hooks"
echo ""
echo "🎉 Votre environnement de développement est prêt!"
