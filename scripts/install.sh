#!/bin/bash

# Script d'installation automatisé pour Sana
# Usage: ./scripts/install.sh

set -e

echo "🚀 Installation automatisée de Sana..."
echo "======================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Fonction pour installer Python
install_python() {
    print_info "Installation de Python 3.10+..."

    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
        if python3 -c "import sys; exit(0 if sys.version_info >= (3, 10) else 1)" 2>/dev/null; then
            print_success "Python $PYTHON_VERSION déjà installé"
            return 0
        fi
    fi

    # Installation selon le système
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_info "Détection de la distribution Linux..."
        if command_exists apt; then
            print_info "Distribution basée sur Debian/Ubuntu détectée"
            sudo apt update
            sudo apt install -y python3.10 python3.10-venv python3.10-pip
        elif command_exists yum; then
            print_info "Distribution basée sur Red Hat détectée"
            sudo yum install -y python3.10 python3.10-pip
        elif command_exists pacman; then
            print_info "Distribution Arch Linux détectée"
            sudo pacman -S python
        else
            print_error "Distribution Linux non reconnue"
            return 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "macOS détecté"
        if command_exists brew; then
            brew install python@3.10
        else
            print_error "Homebrew non installé. Installez-le d'abord : https://brew.sh/"
            return 1
        fi
    else
        print_error "Système d'exploitation non supporté"
        return 1
    fi

    print_success "Python installé avec succès"
}

# Fonction pour installer Node.js
install_nodejs() {
    print_info "Installation de Node.js 18+..."

    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        if node -e "process.exit(process.version.split('v')[1].split('.')[0] >= 18 ? 0 : 1)" 2>/dev/null; then
            print_success "Node.js $NODE_VERSION déjà installé"
            return 0
        fi
    fi

    # Installation selon le système
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_info "Installation de Node.js via NodeSource..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            brew install node@18
        else
            print_error "Homebrew requis pour l'installation sur macOS"
            return 1
        fi
    else
        print_error "Système d'exploitation non supporté"
        return 1
    fi

    print_success "Node.js installé avec succès"
}

# Fonction pour installer pnpm
install_pnpm() {
    print_info "Installation de pnpm..."

    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm $PNPM_VERSION déjà installé"
        return 0
    fi

    if command_exists npm; then
        npm install -g pnpm
        print_success "pnpm installé avec succès"
    else
        print_error "npm non trouvé. Installez Node.js d'abord."
        return 1
    fi
}

# Fonction pour installer Docker
install_docker() {
    print_info "Installation de Docker..."

    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker $DOCKER_VERSION déjà installé"
        return 0
    fi

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_info "Installation de Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        print_warning "Redémarrez votre session pour que les changements prennent effet"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "Téléchargez Docker Desktop depuis : https://www.docker.com/products/docker-desktop/"
        print_warning "Installation manuelle requise sur macOS"
        return 1
    else
        print_error "Système d'exploitation non supporté"
        return 1
    fi

    print_success "Docker installé avec succès"
}

# Fonction pour configurer l'environnement backend
setup_backend() {
    print_info "Configuration du backend..."

    cd backend

    # Créer l'environnement virtuel
    if [ ! -d ".venv" ]; then
        print_info "Création de l'environnement virtuel Python..."
        python3 -m venv .venv
    fi

    # Activer l'environnement virtuel
    source .venv/bin/activate

    # Installer les dépendances
    print_info "Installation des dépendances Python..."
    pip install --upgrade pip
    pip install -r requirements.txt
    pip install -r requirement-dev.txt

    # Configurer .env si nécessaire
    if [ ! -f ".env" ]; then
        print_info "Création du fichier .env..."
        cp .env.example .env
        print_warning "⚠️  IMPORTANT : Configurez vos clés API dans backend/.env"
        print_info "  • OpenAI : https://platform.openai.com/api-keys"
        print_info "  • ElevenLabs : https://elevenlabs.io/app/api-key"
    fi

    deactivate
    cd ..

    print_success "Backend configuré avec succès"
}

# Fonction pour configurer l'environnement frontend
setup_frontend() {
    print_info "Configuration du frontend..."

    cd frontend

    # Installer les dépendances
    print_info "Installation des dépendances Node.js..."
    pnpm install

    cd ..

    print_success "Frontend configuré avec succès"
}

# Fonction pour démarrer MongoDB
start_mongodb() {
    print_info "Démarrage de MongoDB..."

    # Vérifier si MongoDB est déjà en cours
    if docker ps | grep -q "sana-mongodb"; then
        print_success "MongoDB déjà en cours d'exécution"
        return 0
    fi

    # Arrêter et supprimer l'ancien conteneur s'il existe
    if docker ps -a | grep -q "sana-mongodb"; then
        print_info "Nettoyage de l'ancien conteneur MongoDB..."
        docker stop sana-mongodb 2>/dev/null || true
        docker rm sana-mongodb 2>/dev/null || true
    fi

    # Démarrer MongoDB
    print_info "Démarrage du conteneur MongoDB..."
    docker run -d --name sana-mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=sana_test mongo:latest

    # Attendre que MongoDB soit prêt
    print_info "Attente que MongoDB soit prêt..."
    sleep 5

    # Vérifier la connectivité
    if docker exec sana-mongodb mongosh --eval "db.runCommand('ping')" &>/dev/null; then
        print_success "MongoDB démarré avec succès"
    else
        print_error "MongoDB ne répond pas"
        return 1
    fi
}

# Fonction pour rendre les scripts exécutables
make_scripts_executable() {
    print_info "Configuration des permissions..."

    chmod +x scripts/setup-dev.sh
    chmod +x scripts/diagnostic.sh
    chmod +x backend/launch.sh

    print_success "Permissions configurées"
}

# Fonction principale
main() {
    echo ""
    print_info "Vérification des prérequis..."

    # Vérifier et installer Python
    if ! command_exists python3 || ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 10) else 1)" 2>/dev/null; then
        install_python
    else
        PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION déjà installé"
    fi

    # Vérifier et installer Node.js
    if ! command_exists node || ! node -e "process.exit(process.version.split('v')[1].split('.')[0] >= 18 ? 0 : 1)" 2>/dev/null; then
        install_nodejs
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        print_success "Node.js $NODE_VERSION déjà installé"
    fi

    # Vérifier et installer pnpm
    if ! command_exists pnpm; then
        install_pnpm
    else
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm $PNPM_VERSION déjà installé"
    fi

    # Vérifier et installer Docker
    if ! command_exists docker; then
        install_docker
    else
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker $DOCKER_VERSION déjà installé"
    fi

    echo ""
    print_info "Configuration de l'environnement..."

    # Configurer les permissions
    make_scripts_executable

    # Configurer le backend
    setup_backend

    # Configurer le frontend
    setup_frontend

    # Démarrer MongoDB
    start_mongodb

    echo ""
    print_success "🎉 Installation terminée avec succès !"
    echo ""
    print_info "Prochaines étapes :"
    echo "  1. Configurez vos clés API dans backend/.env"
    echo "  2. Lancez le diagnostic : ./scripts/diagnostic.sh"
    echo "  3. Démarrez le backend : cd backend && ./launch.sh"
    echo "  4. Démarrez le frontend : cd frontend && pnpm start"
    echo ""
    print_warning "⚠️  N'oubliez pas de configurer vos clés API dans backend/.env !"
    echo ""
}

# Gestion des erreurs
trap 'print_error "Installation interrompue"; exit 1' INT TERM

# Exécuter la fonction principale
main "$@"
