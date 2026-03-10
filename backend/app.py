import os
from flask import Flask, send_from_directory
import openpyxl as op # Para ver e editar arquivos .xlsx
from datetime import (
    datetime,
)
# Caminho base do projeto (uma pastacima do backend)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Pasta frontend (HTML, JS)
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Pasta static (CSS)
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Pasta db (Banco de Dados)
DB_DIR = os.path.join(BASE_DIR, "db")
EXCEL_FILE = os.path.join(DB_DIR, "clients.xlsx")

# Cabecalhos das colunas do Excel (linha 1)
COLUNAS = [
    "ID",
    "Nome",
    "CPF",
    "Email",
    "Telefone",
    "Endereço",
    "Observações",
    "Data Cadastro"
]

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="/static")

# Pagina principal
@app.route("/")
def home():
    print(send_from_directory(FRONTEND_DIR, "consultar.html"))
    # return "Bom dia galera 2B!"
    return send_from_directory(FRONTEND_DIR, "index.html")

# Pagina de consulta
@app.route("/consulta")
def consulta_page():
    return send_from_directory(FRONTEND_DIR, "consultar.html")

# Pagina de alteracao
@app.route("/alterar")
def alterar_page():
    return send_from_directory(FRONTEND_DIR, "alterar.html")

if __name__ == "__main__":
    print("Base: ", BASE_DIR)
    print("Front: ", FRONTEND_DIR)
    print("Static:", STATIC_DIR)
    app.run(debug=True)