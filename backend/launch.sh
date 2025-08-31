#!/bin/bash

echo "🚀 Lancement du backend Sana..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Installez Docker d'abord."
    exit 1
fi

# Vérifier si MongoDB tourne déjà
if docker ps | grep -q "sana-mongodb"; then
    echo "✅ MongoDB est déjà en cours d'exécution"
else
    echo "🐳 Démarrage de MongoDB..."
    docker run -d --name sana-mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=sana_test mongo:latest

    # Attendre que MongoDB soit prêt
    echo "⏳ Attente que MongoDB soit prêt..."
    sleep 5
fi

# Vérifier que MongoDB répond
if docker exec sana-mongodb mongosh --eval "db.runCommand('ping')" &> /dev/null; then
    echo "✅ MongoDB est prêt et répond"
else
    echo "❌ MongoDB ne répond pas. Vérifiez les logs avec: docker logs sana-mongodb"
    exit 1
fi

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "🐍 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances si nécessaire
if [ ! -f "venv/lib/python*/site-packages/fastapi" ]; then
    echo "📦 Installation des dépendances..."
    pip install -r requirements.txt
fi

# Vérifier les variables d'environnement
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé. Créez-le avec vos clés API."
    echo "Exemple de contenu:"
    echo "OPENAI_API_KEY=votre_clé_openai"
    echo "ELEVEN_LABS_API_KEY=votre_clé_eleven_labs"
    echo "MONGODB_URI=mongodb://localhost:27017/sana_test"
fi

# Lancer le serveur FastAPI
echo "🚀 Lancement du serveur FastAPI..."
echo "📱 API disponible sur: http://localhost:8000"
echo "📚 Documentation: http://localhost:8000/docs"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
