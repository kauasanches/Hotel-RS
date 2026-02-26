from flask import Flask, request

app = Flask(__name__)

@app.route("/")

def home():
    return "Bom dia galera 2B!"

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username') # Captura o valor
    return f"Olá, {username}"

app.run()