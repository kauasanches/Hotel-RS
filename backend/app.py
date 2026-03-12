import os
from flask import Flask, send_from_directory
import openpyxl # Para ver e editar arquivos .xlsx
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
EXCEL_FILE = os.path.join(DB_DIR, "clientes.xlsx")

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

def init_excel():
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR) # Cria a pasta se não existir
    
    if not os.path.exists(EXCEL_FILE):
        workbook = openpyxl.Workbook() # Cria a planilha
        sheet = workbook.active # Pega a planilha ativa
        sheet.title = "Clientes" # Nomeia a aba principal
        sheet.append(COLUNAS) # Adiciona os títulos das colunas
        workbook.save(EXCEL_FILE) # Salva o arquivo Excel

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="/static")

# Pagina principal
@app.route("/")
def home():
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
    print("DB:", DB_DIR)
    print("Excel:", EXCEL_FILE)
    init_excel()
    app.run(debug=True)