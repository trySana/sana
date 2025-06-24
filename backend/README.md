
# Configuration 
```python 
pip3 install virtualenv 
python3 -m venv venv
source venv/bin/activate
```

# Installer les dépendances avec pip

```BASH 
pip install -r requirements.txt
```


# Lancement du backend 
```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```