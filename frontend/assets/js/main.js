//alert("JS carregou!");
// Essa linha mostra um alerta na tela dizendo que o JavaScript foi carregado.
// Está comentada (//) então não executa.
// Serve apenas para testar se o arquivo main.js está funcionando.
// Aqui estamos dizendo:
// "Espere o HTML carregar completamente antes de executar o JavaScript"
document.addEventListener("DOMContentLoaded", function () {
    // Aqui estamos pegando o formulário pelo ID.
    // No HTML precisa existir: <form id="formCadastro">
    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        // Agora estamos dizendo:
        // "Quando o formulário for enviado (botão Enviar clicado)..."
        formCadastro.addEventListener("submit", async (e) => {
            // Impede o comportamento padrão do navegador.
            // Normalmente o formulário recarrega a página.
            // Isso bloqueia o recarregamento.
            e.preventDefault();
            // Aqui acontece a parte mais importante:
            // 1) new FormData(formCadastro) → pega todos os campos do formulário
            // 2) Object.fromEntries(...) → transforma esses dados em um objeto JavaScript
            const dados = Object.fromEntries(
                new FormData(formCadastro)
            );
            try {
                // 🚀 Envia os dados ao backend (rota /cadastrar) via POST
                const resp = await fetch('/api/cadastrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
                // 💬 Recebe a resposta do Flask (JSON)
                const result = await resp.json();
                // 📢 Exibe a mensagem de retorno para o usuário
                document.getElementById('mensagem').innerText = result.message;
                // 🧹 Limpa os campos após o envio
                formCadastro.reset();
            } catch (err) {
                // ⚠️ Caso algo dê errado (servidor fora do ar, etc.)
                alert('Erro de comunicação com o servidor: ' + err);
            }
            // Agora vamos mostrar os dados no Console (F12 → Console)

            console.log("Dados capturados:");
            // Mostra apenas o campo nome
            console.log("Nome:", dados.nome);
            // Mostra o campo email (só funciona se existir no HTML)
            console.log("Email:", dados.email);
            // Mostra o campo telefone (só funciona se existir no HTML)
            console.log("Telefone:", dados.telefone);
            // Mostra o objeto completo com todos os dados
            console.log(dados);
        });
    }



    // ============================================================================
    // 🔍 CONSULTA DE CLIENTES
    // ============================================================================

    // 💡 Essa parte funciona na página consulta.html
    const btnBuscar = document.getElementById('btnBuscar');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {

            // 🧠 Pega o nome digitado pelo usuário
            const nome = document.getElementById('campoBusca').value;

            // 🚀 Faz uma requisição GET ao Flask, enviando o nome como parâmetro
            const resp = await fetch(`/api/buscar?nome=${nome}`);
            const clientes = await resp.json(); // 📥 Recebe lista de clientes

            const tabela = document.getElementById('tabelaResultados');
            tabela.innerHTML = ''; // 🧹 Limpa a tabela antes de exibir os novos resultados

            // 💡 Para cada cliente retornado, cria uma nova linha na tabela HTML
            clientes.forEach(cli => {
                const row = `
                <tr>
                    <td>${cli.ID}</td>
                    <td>${cli.Nome}</td>
                    <td>${cli.CPF}</td>
                    <td>${cli.Email}</td>
                    <td>${cli.Telefone}</td>
                    <td>${cli.observacoes}</td>
                    <td><a href="/alterar?id=${cli.ID}" class="btn btn-sm btn-warning">Editar</a></td>
                </tr>`;
                tabela.innerHTML += row;
            });
        });
    }


    // ============================================================================
    // ✏️ ALTERAR CLIENTE
    // ============================================================================

    // 💡 Essa parte roda na página alterar.html
    const formAlterar = document.getElementById('formAlterar');

    if (formAlterar) {
        // 📎 Captura o ID do cliente a partir da URL (ex: /alterar?id=3)
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const mensagem = document.getElementById('mensagem');

        // --------------------------------------------------------------
        // 🔍 Ao carregar a página, busca os dados do cliente no backend
        // --------------------------------------------------------------
        fetch(`/api/cliente/${id}`)
            .then(r => r.json())
            .then(cli => {
                // 💡 Preenche automaticamente os campos do formulário
                document.getElementById('clienteId').value = cli.ID;
                document.getElementById('nome').value = cli.Nome;
                document.getElementById('cpf').value = cli.CPF;
                document.getElementById('email').value = cli.Email;
                document.getElementById('telefone').value = cli.Telefone;
                document.getElementById('endereco').value = cli.Endereço;
                document.getElementById('observacoes').value = cli.Observações;
            });

        // --------------------------------------------------------------
        // 💾 Envio das alterações ao servidor
        // --------------------------------------------------------------
        formAlterar.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 🧾 Monta um objeto com os novos dados digitados
            const dados = {
                nome: nome.value,
                cpf: cpf.value,
                email: email.value,
                telefone: telefone.value,
                endereco: endereco.value,
                observacoes: observacoes.value
            };

            // 🚀 Envia para o backend (rota /api/atualizar/<id>)
            const resp = await fetch(`/api/atualizar/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const result = await resp.json();
            mensagem.innerText = result.message; // 📢 Mostra o retorno na tela
        });
    }
})