#!/bin/bash

# Script de diagnostic pour Sana
# Usage: ./scripts/diagnostic.sh

set -e

echo "🔍 Diagnostic du setup Sana..."
echo "================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
echo "📋 Vérification des prérequis..."

# 1. Vérifier Python
echo -n "Python 3.10+ : "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    if python3 -c "import sys; exit(0 if sys.version_info >= (3, 10) else 1)" 2>/dev/null; then
        print_result 0 "Python $PYTHON_VERSION installé"
    else
        print_result 1 "Python $PYTHON_VERSION installé mais version < 3.10"
    fi
else
    print_result 1 "Python 3 non installé"
fi

# 2. Vérifier Node.js
echo -n "Node.js 18+ : "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    if node -e "process.exit(process.version.split('v')[1].split('.')[0] >= 18 ? 0 : 1)" 2>/dev/null; then
        print_result 0 "Node.js $NODE_VERSION installé"
    else
        print_result 1 "Node.js $NODE_VERSION installé mais version < 18"
    fi
else
    print_result 1 "Node.js non installé"
fi

# 3. Vérifier pnpm
echo -n "pnpm : "
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    print_result 0 "pnpm $PNPM_VERSION installé"
else
    print_result 1 "pnpm non installé"
fi

# 4. Vérifier Docker
echo -n "Docker : "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    print_result 0 "Docker $DOCKER_VERSION installé"
else
    print_result 1 "Docker non installé"
fi

echo ""
echo "📁 Vérification des fichiers de configuration..."

# 5. Vérifier .env.example
echo -n ".env.example : "
if [ -f "backend/.env.example" ]; then
    print_result 0 "Fichier trouvé"
else
    print_result 1 "Fichier manquant"
fi

# 6. Vérifier .env
echo -n ".env : "
if [ -f "backend/.env" ]; then
    print_result 0 "Fichier trouvé"
    # Vérifier si les clés API sont configurées
    if grep -q "your_openai_api_key_here" backend/.env; then
        print_warning "Clés API non configurées dans .env"
    fi
else
    print_result 1 "Fichier manquant"
    print_info "Copiez .env.example vers .env et configurez vos clés API"
fi

echo ""
echo "🐍 Vérification Python..."

# 7. Vérifier les environnements virtuels
echo -n "Environnement virtuel : "
if [ -d "backend/.venv" ]; then
    print_result 0 "Environnement .venv trouvé"
elif [ -d "backend/venv" ]; then
    print_result 0 "Environnement venv trouvé"
    print_warning "Considérez utiliser .venv pour la cohérence"
else
    print_result 1 "Aucun environnement virtuel trouvé"
    print_info "Créez un environnement virtuel avec: python3 -m venv backend/.venv"
fi

# 8. Vérifier les dépendances Python
if [ -d "backend/.venv" ] || [ -d "backend/venv" ]; then
    echo -n "Dépendances Python : "
    if [ -d "backend/.venv" ]; then
        source backend/.venv/bin/activate
    else
        source backend/venv/bin/activate
    fi

    if python -c "import fastapi, openai, whisper" 2>/dev/null; then
        print_result 0 "Dépendances principales installées"
    else
        print_result 1 "Dépendances manquantes"
        print_info "Installez avec: pip install -r backend/requirements.txt"
    fi
    deactivate
fi

echo ""
echo "🐳 Vérification MongoDB..."

# 9. Vérifier MongoDB
echo -n "MongoDB Docker : "
if docker ps | grep -q "sana-mongodb"; then
    print_result 0 "MongoDB en cours d'exécution"

    # Vérifier la connectivité
    echo -n "Connectivité MongoDB : "
    if docker exec sana-mongodb mongosh --eval "db.runCommand('ping')" &>/dev/null; then
        print_result 0 "MongoDB répond"
    else
        print_result 1 "MongoDB ne répond pas"
    fi
else
    print_result 1 "MongoDB non démarré"
    print_info "Démarrez avec: docker run -d --name sana-mongodb -p 27017:27017 mongo:latest"
fi

echo ""
echo "📱 Vérification Frontend..."

# 10. Vérifier node_modules
echo -n "node_modules : "
if [ -d "frontend/node_modules" ]; then
    print_result 0 "Dépendances installées"
else
    print_result 1 "Dépendances manquantes"
    print_info "Installez avec: cd frontend && pnpm install"
fi

# 11. Vérifier la configuration API
echo -n "Configuration API : "
if grep -q "localhost:8000" frontend/constants/api.ts; then
    print_result 0 "Configuration API correcte"
else
    print_result 1 "Configuration API incorrecte"
fi

echo ""
echo "🌐 Vérification des ports..."

# 12. Vérifier le port 8000 (doit être libre)
echo -n "Port 8000 : "
if netstat -tulpn 2>/dev/null | grep -q ":8000"; then
    print_result 1 "Port 8000 occupé"
    print_info "Arrêtez le processus ou changez le port"
else
    print_result 0 "Port 8000 libre"
fi

# 13. Vérifier le port 27017 (doit être utilisé par MongoDB)
echo -n "Port 27017 : "
if netstat -tulpn 2>/dev/null | grep -q ":27017"; then
    print_result 0 "Port 27017 en cours d'utilisation"
else
    print_result 1 "Port 27017 libre (MongoDB non démarré ?)"
fi

echo ""
echo "🔐 Vérification des permissions..."

# 14. Vérifier les permissions des scripts
echo -n "Scripts exécutables : "
if [ -x "scripts/setup-dev.sh" ] && [ -x "backend/launch.sh" ]; then
    print_result 0 "Scripts exécutables"
else
    print_result 1 "Scripts non exécutables"
    print_info "Rendez exécutables avec: chmod +x scripts/setup-dev.sh backend/launch.sh"
fi

echo ""
echo "🏁 Résumé du diagnostic..."

# Compter les erreurs
ERRORS=0
WARNINGS=0

# Afficher les recommandations
echo ""
echo "📋 Recommandations :"

if ! command -v python3 &> /dev/null || ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 10) else 1)" 2>/dev/null; then
    echo "  • Installez Python 3.10+ : sudo apt install python3.10 python3.10-venv"
    ((ERRORS++))
fi

if ! command -v node &> /dev/null || ! node -e "process.exit(process.version.split('v')[1].split('.')[0] >= 18 ? 0 : 1)" 2>/dev/null; then
    echo "  • Installez Node.js 18+ : curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    ((ERRORS++))
fi

if ! command -v pnpm &> /dev/null; then
    echo "  • Installez pnpm : npm install -g pnpm"
    ((ERRORS++))
fi

if ! command -v docker &> /dev/null; then
    echo "  • Installez Docker : https://docs.docker.com/get-docker/"
    ((ERRORS++))
fi

if [ ! -f "backend/.env" ]; then
    echo "  • Créez le fichier .env : cp backend/.env.example backend/.env"
    ((ERRORS++))
fi

if ! docker ps | grep -q "sana-mongodb"; then
    echo "  • Démarrez MongoDB : docker run -d --name sana-mongodb -p 27017:27017 mongo:latest"
    ((ERRORS++))
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "  • Installez les dépendances frontend : cd frontend && pnpm install"
    ((ERRORS++))
fi

if [ ! -d "backend/.venv" ] && [ ! -d "backend/venv" ]; then
    echo "  • Créez l'environnement virtuel : cd backend && python3 -m venv .venv"
    ((ERRORS++))
fi

echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Tous les prérequis sont satisfaits !${NC}"
    echo "Vous pouvez maintenant lancer le projet :"
    echo "  • Backend : cd backend && ./launch.sh"
    echo "  • Frontend : cd frontend && pnpm start"
else
    echo -e "${RED}⚠️  $ERRORS problème(s) détecté(s)${NC}"
    echo "Résolvez les problèmes ci-dessus avant de continuer."
fi

echo ""
echo "📞 Pour plus d'aide, consultez DIAGNOSTIC_SETUP.md"
