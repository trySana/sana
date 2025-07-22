import json

from jinja2 import Environment
from jinja2 import FileSystemLoader
from weasyprint import HTML

with open("mock.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Préparer l'environnement Jinja2
env = Environment(loader=FileSystemLoader("."))
template = env.get_template("template.html")

# Rendre le HTML avec les données du JSON
html_out = template.render(**data)

# Générer le PDF
HTML(string=html_out).write_pdf("rapport_medical.pdf")

print("✅ PDF généré avec succès : rapport_medical.pdf")
