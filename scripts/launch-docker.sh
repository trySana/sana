#!/bin/bash

# Script de lancement Docker pour Sana
# Usage: ./scripts/launch-docker.sh

set -e

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

echo "🐳 Lancement de Sana avec Docker..."
echo "=================================="

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé"
    echo "Installez Docker depuis : https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé"
    echo "Installez Docker Compose depuis : https://docs.docker.com/compose/install/"
    exit 1
fi

# Vérifier que les ports sont libres
print_info "Vérification des ports..."

if netstat -tulpn 2>/dev/null | grep -q ":8000"; then
    print_warning "Port 8000 occupé"
    read -p "Voulez-vous arrêter le processus qui utilise le port 8000 ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo lsof -ti:8000 | xargs kill -9 2>/dev/null || true
        print_success "Port 8000 libéré"
    else
        print_error "Impossible de continuer avec le port 8000 occupé"
        exit 1
    fi
fi

if netstat -tulpn 2>/dev/null | grep -q ":27017"; then
    print_warning "Port 27017 occupé"
    read -p "Voulez-vous arrêter le processus qui utilise le port 27017 ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo lsof -ti:27017 | xargs kill -9 2>/dev/null || true
        print_success "Port 27017 libéré"
    else
        print_error "Impossible de continuer avec le port 27017 occupé"
        exit 1
    fi
fi

# Vérifier le fichier .env
if [ ! -f "backend/.env" ]; then
    print_warning "Fichier .env non trouvé"
    if [ -f "backend/.env.example" ]; then
        print_info "Création du fichier .env à partir de .env.example"
        cp backend/.env.example backend/.env
        print_warning "⚠️  IMPORTANT : Configurez vos clés API dans backend/.env"
        print_info "  • OpenAI : https://platform.openai.com/api-keys"
        print_info "  • ElevenLabs : https://elevenlabs.io/app/api-key"
        echo ""
        read -p "Appuyez sur Entrée après avoir configuré vos clés API..."
    else
        print_error "Fichier .env.example non trouvé"
        exit 1
    fi
fi

# Vérifier que les clés API sont configurées
if grep -q "your_openai_api_key_here" backend/.env; then
    print_warning "Clés API non configurées dans .env"
    print_info "Configurez vos clés API avant de continuer"
    exit 1
fi

# Arrêter les conteneurs existants s'ils existent
print_info "Nettoyage des conteneurs existants..."
docker-compose down 2>/dev/null || true

# Construire et démarrer les services
print_info "Construction et démarrage des services..."
docker-compose up --build -d

# Attendre que les services soient prêts
print_info "Attente que les services soient prêts..."
sleep 10

# Vérifier que les services fonctionnent
print_info "Vérification des services..."

# Vérifier MongoDB
if docker exec sana-mongodb mongosh --eval "db.runCommand('ping')" &>/dev/null; then
    print_success "MongoDB fonctionne"
else
    print_error "MongoDB ne répond pas"
    docker-compose logs mongodb
    exit 1
fi

# Vérifier le backend
if curl -f http://localhost:8000/ &>/dev/null; then
    print_success "Backend fonctionne"
else
    print_error "Backend ne répond pas"
    docker-compose logs backend
    exit 1
fi

echo ""
print_success "🎉 Sana est prêt !"
echo ""
print_info "Services disponibles :"
echo "  • Backend API : http://localhost:8000"
echo "  • Documentation API : http://localhost:8000/docs"
echo "  • MongoDB : localhost:27017"
echo ""
print_info "Commandes utiles :"
echo "  • Voir les logs : docker-compose logs -f"
echo "  • Arrêter : docker-compose down"
echo "  • Redémarrer : docker-compose restart"
echo "  • Reconstruire : docker-compose up --build"
echo ""
print_info "Pour lancer le frontend :"
echo "  cd frontend && pnpm start"
echo ""
print_warning "⚠️  Gardez ce terminal ouvert pour voir les logs en temps réel"
echo "Appuyez sur Ctrl+C pour arrêter les services"

# Afficher les logs en temps réel
docker-compose logs -f
