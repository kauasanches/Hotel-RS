document.addEventListener("DOMContentLoaded", function () {

  // ==========================================================================
  // MOBILE NAV TOGGLE
  // ==========================================================================
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("open");
      }
    });
  }

  // ==========================================================================
  // CAROUSEL
  // ==========================================================================
  const carouselInner = document.getElementById("carouselInner");
  if (carouselInner) {
    let currentSlide = 0;
    const items = carouselInner.querySelectorAll(".carousel-item");
    if (items.length > 1) {
      setInterval(function () {
        currentSlide = (currentSlide + 1) % items.length;
        carouselInner.style.transform = "translateX(-" + (currentSlide * 100) + "%)";
      }, 4000);
    }
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = type;
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.classList.add("loading");
      btn.disabled = true;
    } else {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  }

  function getFormData(form) {
    var data = {};
    var elements = form.querySelectorAll("[name]");
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.type !== "submit") {
        data[el.name] = el.value;
      }
    }
    return data;
  }

  // ==========================================================================
  // PAGE 1: CADASTRO
  // ==========================================================================
  var formCadastro = document.getElementById("formCadastro");

  if (formCadastro) {
    formCadastro.addEventListener("submit", async function (e) {
      e.preventDefault();

      var msg = document.getElementById("mensagem");
      var btn = document.getElementById("btnCadastrar");

      var dados = getFormData(formCadastro);

      if (!dados.nome || !dados.cpf || !dados.email || !dados.telefone || !dados.endereco) {
        showMessage(msg, "Preencha todos os campos obrigatórios.", "error");
        return;
      }

      setLoading(btn, true);
      showMessage(msg, "", "");

      try {
        var resp = await fetch("/api/cadastrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados)
        });
        var result = await resp.json();

        if (resp.ok) {
          showMessage(msg, "Hóspede cadastrado com sucesso!", "success");
          formCadastro.reset();
        } else {
          showMessage(msg, result.message || "Erro ao cadastrar.", "error");
        }
      } catch (err) {
        showMessage(msg, "Erro de comunicação com o servidor.", "error");
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // ==========================================================================
  // PAGE 2: CONSULTA
  // ==========================================================================
  var btnBuscar = document.getElementById("btnBuscar");
  var campoBusca = document.getElementById("campoBusca");

  function buscarClientes() {
    if (!campoBusca) return;
    var nome = campoBusca.value.trim();
    var tabela = document.getElementById("tabelaResultados");
    if (!tabela) return;
    
    tabela.innerHTML = '<tr><td colspan="6"><div class="empty-state"><p>Buscando...</p></div></td></tr>';

    fetch("/api/buscar?nome=" + encodeURIComponent(nome))
      .then(function (r) { return r.json(); })
      .then(function (clientes) {
        if (!clientes || clientes.length === 0) {
          tabela.innerHTML =
            '<tr><td colspan="6"><div class="empty-state">' +
            '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>' +
            '<p>Nenhum hóspede encontrado</p>' +
            '<span>Tente outro nome.</span></div></td></tr>';
          return;
        }
        var html = "";
        for (var i = 0; i < clientes.length; i++) {
          var cli = clientes[i];
          html += "<tr>" +
            "<td>" + (cli.ID || "") + "</td>" +
            "<td>" + (cli.Nome || "") + "</td>" +
            "<td>" + (cli.CPF || "") + "</td>" +
            "<td>" + (cli.Email || "") + "</td>" +
            "<td>" + (cli.Telefone || "") + "</td>" +
            '<td><a href="/alterar?id=' + (cli.ID || "") + '" class="btn-edit">' +
            '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>' +
            "Editar</a></td>" +
            "</tr>";
        }
        tabela.innerHTML = html;
      })
      .catch(function () {
        tabela.innerHTML =
          '<tr><td colspan="6"><div class="empty-state"><p>Erro ao buscar dados.</p></div></td></tr>';
      });
  }

  if (btnBuscar) {
    btnBuscar.addEventListener("click", buscarClientes);
  }

  if (campoBusca) {
    campoBusca.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        buscarClientes();
      }
    });
  }

  // ==========================================================================
  // PAGE 3: ALTERAR
  // ==========================================================================
  var formAlterar = document.getElementById("formAlterar");

  if (formAlterar) {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get("id");
    var msg = document.getElementById("mensagem");

    // Preenche formulário com dados do cliente
    if (id) {
      fetch("/api/cliente/" + id)
        .then(function (r) { return r.json(); })
        .then(function (cli) {
          if (cli.status === "error") {
            if (msg) msg.textContent = cli.message;
            return;
          }
          document.getElementById("clienteId").value = cli.ID || "";
          document.getElementById("nome").value = cli.Nome || "";
          document.getElementById("cpf").value = cli.CPF || "";
          document.getElementById("email").value = cli.Email || "";
          document.getElementById("telefone").value = cli.Telefone || "";
          document.getElementById("endereco").value = cli.Endereço || "";
          document.getElementById("observacoes").value = cli.Observações || "";
        })
        .catch(function () {
          if (msg) showMessage(msg, "Erro ao carregar dados do hóspede.", "error");
        });
    } else {
      if (msg) showMessage(msg, "ID do hóspede não informado.", "error");
    }

    // Envio do formulário
    formAlterar.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!id) {
        showMessage(msg, "ID do hóspede não encontrado.", "error");
        return;
      }

      var btn = document.getElementById("btnSalvar");

      var dados = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
        observacao: document.getElementById("observacoes").value
      };

      setLoading(btn, true);

      try {
        var resp = await fetch("/api/atualizar/" + id, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados)
        });
        var result = await resp.json();

        if (resp.ok) {
          showMessage(msg, "Dados atualizados com sucesso!", "success");
        } else {
          showMessage(msg, result.message || "Erro ao atualizar.", "error");
        }
      } catch (err) {
        showMessage(msg, "Erro de comunicação com o servidor.", "error");
      } finally {
        setLoading(btn, false);
      }
    });
  }

});
