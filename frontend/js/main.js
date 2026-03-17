alert("JS carregou!")

// Espera quando o HTML carregar completamente antes de executar o JavaScript
document.addEventListener("DOMContentLoaded", function() {

    // Aqui estamos pegando o formulário pelo ID
    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            // Bloqueia o recarregamento padrão
            e.preventDefault();
    
            // Cria um objeto completo com todos os dados
            // 1) new FormData(formCadastro) -> pega todos os campos do formulário
            // 2) Object.fromEntries -> tranformas os dados em um objeto
            const dados = Object.fromEntries(
                new FormData(formCadastro)
            );

            try {
                const resp = await fetch('/api/cadastrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                // Recebe a resposta do Flask (JSON)
                const result = await resp.json()

                // Exibe a mensagem de retorno para o usuário
                document.getElementById
            }
            catch (erro) {
                // Caso algo dê errado (servidor fora do ar, etc...)
                alert("Erro de comunicação com o servidor: " + erro)
            }
    
            // Agora vamos mostrar os dados no Console
            alert("JS carregou!")
            console.log("Dados capturados:");
            // Mostra o campo nome
            console.log("Nome: ", dados.nome);
            // Mostra o campo email
            console.log("Email: ", dados.email);
            // Mostra o campo telefone
            console.log("Telefone: ", dados.telefone);
            // Mostra o objeto completo com todos os dados
            console.log(dados);
        })
    }
})