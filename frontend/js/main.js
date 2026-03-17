alert("JS carregou!")

// Espera quando o HTML carregar completamente antes de executar o JavaScript
document.addEventListener("DOMContentLoaded", function() {

    // Aqui estamos pegando o formulário pelo ID
    const formCadastro = document.getElementById("formCadastro");

    formCadastro.addEventListener("submit", function (e) {
        // Bloqueia o recarregamento padrão
        e.preventDefault();

        // Cria um objeto completo com todos os dados
        // 1) new FormData(formCadastro) -> pega todos os campos do formulário
        // 2) Object.fromEntries -> tranformas os dados em um objeto
        const dados = Object.fromEntries(
            new FormData(formCadastro)
        );

        // Agora vamos mostrar os dados no Console

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
})