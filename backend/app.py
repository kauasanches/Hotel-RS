import os
from flask import Flask, send_from_directory, request, jsonify
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

# Pasta do JS
JS_DIR = os.path.join(BASE_DIR, "frontend", "js")
JS_FILE = os.path.join(JS_DIR, "main.js")

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
    return send_from_directory(FRONTEND_DIR, "index.html")

# Pagina de consulta
@app.route("/consulta")
def consulta_page():
    return send_from_directory(FRONTEND_DIR, "consultar.html")

# Pagina de alteracao
@app.route("/alterar")
def alterar_page():
    return send_from_directory(FRONTEND_DIR, "alterar.html")

# Rota para servir imagens, sripts ou outros arquivos na pasta "assets"
@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory("../frontend/assets", filename)

# INFOS PROFESSOR
# Nome: José Antônio dos Reis
# CPF: 087.280.297.39
# Email: apoio.klesis@gmail.com
# Telefone: 41985147636
# Rua das Nações Unidas, 871

# -------------------------------------------------------------------------------------------------
# CADASTRAR CLIENTE
# -------------------------------------------------------------------------------------------------
@app.route("/cadastrar", methods=["POST"])
def cadastrar_cliente():
    """
    Recebe os dados do formulário (em JSON), valida e salva um novo cliente
    """
    try:
        data = request.json # Dados enviados do frontend via POST (JSON)

        # Capmos obrigatórios que o usuário deve preencher
        required_fields = ["nome", "cpf", "email", "telefone", "endereco"]
        if not all(field in data and data[field] for field in required_fields):
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Todos os campos obrigatórios devem ser preenchidos."
                    }
                ),
                400,
            )
        workbook = openpyxl.load_workbook(EXCEL_FILE) # Abre o arquivo Excel
        sheet = workbook.active

        # Cria um ID automático (último ID + 1)
        last_id = 0
        if sheet.max_row > 1:
            last_id = sheet.cell(row=sheet.max_row, column=1).value or 0
        new_id = last_id + 1

        # Cria uma nova linha com os dados informados
        novo_cliente = [
            new_id,
            data.get("nome"),
            data.get("cpf"),
            data.get("email"),
            data.get("telefone"),
            data.get("endereco"),
            data.get("observacoes", ""), # Campo opcional
            datetime.now().strftime("%Y-%m-%d") # Data atual
        ]

        sheet.append(novo_cliente) # Adiciona nova linha no Excel
        workbook.save(EXCEL_FILE) # Salva alterações

        # Retorna mensagem de sucesso
        return (
            jsonify(
                {
                "status": "sucess",
                "message": "Cliente cadastrado com sucesso!",
                "id": new_id
                }
            ),
            201,
        )
    except Exception as e:
        # Tratamento de erro genérico
        return (
            jsonify(
                {
                "status": "error",
                "message": f"Erro ao salvar no servidor: {e}"
                }
            ),
            500,
        )

if __name__ == "__main__":
    print("Base: ", BASE_DIR)
    print("Front: ", FRONTEND_DIR)
    print("Static:", STATIC_DIR)
    print("Excel:", EXCEL_FILE)
    print("JS:", JS_FILE)
    init_excel()
    app.run(debug=True)