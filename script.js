// =========================
//   LOCALSTORAGE
// =========================

let dicionario = new Map(JSON.parse(localStorage.getItem("dicionario")) || []);
let usuarioTipo = null;
let usuarioAtual = null;

const listaPalavras = document.getElementById("listaPalavras");
const contador = document.getElementById("contadorPalavras");

// =========================
//   ELEMENTOS DA INTERFACE
// =========================

// Tela de login
const telaLogin = document.getElementById("telaLogin");
const btnLoginAluno = document.getElementById("btnLoginAluno");
const btnLoginProfessor = document.getElementById("btnLoginProfessor");
const formLogin = document.getElementById("formLogin");
const tituloLogin = document.getElementById("tituloLogin");
const cancelarLogin = document.getElementById("cancelarLogin");
const btnEsqueciSenha = document.getElementById("btnEsqueciSenha");

// Menu
const btnExportar = document.getElementById("btnExportar");
const btnImportar = document.getElementById("btnImportar");
const btnModoEscuro = document.getElementById("btnModoEscuro");
const btnSenha = document.getElementById("btnSenha");
const btnLogoff = document.getElementById("btnLogoff");

// Submenus
const submenuSenha = document.querySelector(".submenu-senha");
const submenuAlterar = document.getElementById("submenuAlterar");
const submenuRedefinir = document.getElementById("submenuRedefinir");

// Modais
const modalResultado = document.getElementById("modalResultado");
const conteudoResultado = document.getElementById("conteudoResultado");
const fecharResultado = document.getElementById("fecharResultado");

const modalInfoExportar = document.getElementById("modalInfoExportar");
const modalInfoImportar = document.getElementById("modalInfoImportar");

const confirmarExportar = document.getElementById("confirmarExportar");
const confirmarImportar = document.getElementById("confirmarImportar");

const modalSenha = document.getElementById("modalSenha");
const senhaTitulo = document.getElementById("senhaTitulo");
const senhaFormulario = document.getElementById("senhaFormulario");
const senhaConfirmar = document.getElementById("senhaConfirmar");

const modalLogoff = document.getElementById("modalLogoff");
const confirmarLogoff = document.getElementById("confirmarLogoff");

// =========================
//   FUNÇÕES AUXILIARES
// =========================

function salvarLocalStorage() {
    localStorage.setItem("dicionario", JSON.stringify([...dicionario]));
}

function capitalizar(p) {
    return p.charAt(0).toUpperCase() + p.slice(1);
}

function atualizarContador() {
    contador.textContent = `Total de palavras: ${dicionario.size}`;
}

function atualizarLista() {
    listaPalavras.innerHTML = "";

    [...dicionario.keys()].sort().forEach((chave) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <span class="palavra-item">${capitalizar(chave)}</span>
            ${usuarioTipo === "professor" ? `<button class="btn-excluir">×</button>` : ""}
        `;

        li.querySelector(".palavra-item").addEventListener("click", () => {
            document.getElementById("busca").value = chave;
            document.getElementById("formBusca").dispatchEvent(new Event("submit"));
        });

        if (usuarioTipo === "professor") {
            li.querySelector(".btn-excluir").addEventListener("click", () => {
                dicionario.delete(chave);
                salvarLocalStorage();
                atualizarLista();
            });
        }

        listaPalavras.appendChild(li);
    });

    atualizarContador();
}

function aplicarPermissoes() {
    const cardCadastro = document.getElementById("cardCadastro");

    if (usuarioTipo === "aluno") {
        cardCadastro.style.display = "none";
        btnImportar.style.display = "none";
    } else {
        cardCadastro.style.display = "block";
        btnImportar.style.display = "inline-block";
    }

    btnLogoff.classList.remove("hidden");
}

// =========================
//   SISTEMA DE SENHAS
// =========================

function garantirSenhaPadrao(matricula) {
    if (!localStorage.getItem("senha_" + matricula)) {
        localStorage.setItem("senha_" + matricula, "1234");
    }
}

function validarSenha(matricula, senhaDigitada) {
    const senhaSalva = localStorage.getItem("senha_" + matricula);
    return senhaDigitada === senhaSalva;
}

// =========================
//   LOGIN
// =========================

btnLoginAluno.addEventListener("click", () => {
    usuarioTipo = "aluno";
    tituloLogin.textContent = "Login de Aluno";
    formLogin.classList.remove("hidden");
});

btnLoginProfessor.addEventListener("click", () => {
    usuarioTipo = "professor";
    tituloLogin.textContent = "Login de Professor";
    formLogin.classList.remove("hidden");
});

cancelarLogin.addEventListener("click", () => {
    formLogin.classList.add("hidden");
    usuarioTipo = null;
});

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const matricula = document.getElementById("loginMatricula").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();

    usuarioAtual = matricula;

    garantirSenhaPadrao(matricula);

    if (!validarSenha(matricula, senha)) {
        alert("Senha incorreta.");
        return;
    }

    telaLogin.style.display = "none";
    aplicarPermissoes();
    atualizarLista();
});

// =========================
//   ESQUECI MINHA SENHA
// =========================

btnEsqueciSenha.addEventListener("click", () => {
    const matricula = document.getElementById("loginMatricula").value.trim();

    if (matricula === "") {
        alert("Digite sua matrícula antes de solicitar a redefinição.");
        return;
    }

    garantirSenhaPadrao(matricula);

    const novaSenha = "12345@";

    localStorage.setItem("senha_" + matricula, novaSenha);

    alert(
        "Um e-mail foi enviado com instruções para redefinir sua senha.\n\n" +
        "(Versão de teste: nova senha gerada = " + novaSenha + ")"
    );
});

// =========================
//   MENU SENHA
// =========================

btnSenha.addEventListener("click", () => {
    submenuSenha.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
    if (!btnSenha.contains(e.target) && !submenuSenha.contains(e.target)) {
        submenuSenha.classList.add("hidden");
    }
});

// =========================
//   ALTERAR SENHA
// =========================

submenuAlterar.addEventListener("click", () => {
    submenuSenha.classList.add("hidden");

    senhaTitulo.textContent = "Alterar Senha";

    senhaFormulario.innerHTML = `
        <label>Senha atual</label>
        <input type="password" id="senhaAtual">

        <label>Nova senha</label>
        <input type="password" id="senhaNova">

        <label>Confirmar nova senha</label>
        <input type="password" id="senhaConfirmarNova">
    `;

    senhaConfirmar.textContent = "Alterar Senha";

    senhaConfirmar.onclick = () => {
        const atual = document.getElementById("senhaAtual").value;
        const nova = document.getElementById("senhaNova").value;
        const confirmar = document.getElementById("senhaConfirmarNova").value;

        const senhaSalva = localStorage.getItem("senha_" + usuarioAtual);

        if (atual !== senhaSalva) {
            alert("Senha atual incorreta.");
            return;
        }

        if (nova !== confirmar) {
            alert("A confirmação não corresponde.");
            return;
        }

        localStorage.setItem("senha_" + usuarioAtual, nova);
        alert("Senha alterada com sucesso!");
        modalSenha.style.display = "none";
    };

    modalSenha.style.display = "flex";
});

// =========================
//   REDEFINIR SENHA (MENU)
// =========================

submenuRedefinir.addEventListener("click", () => {
    submenuSenha.classList.add("hidden");

    senhaTitulo.textContent = "Redefinir Senha";

    senhaFormulario.innerHTML = `
        <label>E-mail cadastrado</label>
        <input type="email" id="emailRedefinir">
    `;

    senhaConfirmar.textContent = "Enviar redefinição";

    senhaConfirmar.onclick = () => {
        const email = document.getElementById("emailRedefinir").value;

        if (email.trim() === "") {
            alert("Digite um e-mail válido.");
            return;
        }

        const novaSenha = "12345@";
        localStorage.setItem("senha_" + usuarioAtual, novaSenha);

        alert(
            "Um e-mail foi enviado com instruções para redefinir sua senha.\n\n" +
            "(Senha gerada na versão de teste: " + novaSenha + ")"
        );

        modalSenha.style.display = "none";
    };

    modalSenha.style.display = "flex";
});

document.querySelectorAll(".fecharSenha").forEach(btn => {
    btn.addEventListener("click", () => modalSenha.style.display = "none");
});

// =========================
//   BUSCA
// =========================

document.getElementById("formBusca").addEventListener("submit", (e) => {
    e.preventDefault();

    let busca = document.getElementById("busca").value.trim().toLowerCase();

    if (dicionario.has(busca)) {
        conteudoResultado.innerHTML = `
            <p><strong>${capitalizar(busca)}</strong></p>
            <p>Significado: <strong>${dicionario.get(busca)}</strong></p>
        `;
    } else {
        conteudoResultado.innerHTML = `<p style="color:red;">Palavra não encontrada.</p>`;
    }

    modalResultado.style.display = "flex";
});

fecharResultado.addEventListener("click", () => {
    modalResultado.style.display = "none";
});

// =========================
//   CADASTRO
// =========================

document.getElementById("formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();

    let palavra = document.getElementById("palavra").value.trim().toLowerCase();
    let definicao = document.getElementById("definicao").value.trim();

    dicionario.set(palavra, definicao);
    salvarLocalStorage();
    atualizarLista();
    document.getElementById("formCadastro").reset();
});

// =========================
//   EXPORTAR PDF
// =========================

btnExportar.addEventListener("click", () => {
    modalInfoExportar.style.display = "flex";
});

document.querySelectorAll(".fecharInfoExportar").forEach(btn => {
    btn.addEventListener("click", () => modalInfoExportar.style.display = "none");
});

confirmarExportar.addEventListener("click", () => {
    modalInfoExportar.style.display = "none";

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Dicionário de Sinônimos", 10, 15);

    let y = 30;
    let letraAtual = "";

    const palavrasOrdenadas = [...dicionario.keys()].sort();

    palavrasOrdenadas.forEach(palavra => {
        const inicial = palavra.charAt(0).toUpperCase();

        if (inicial !== letraAtual) {
            letraAtual = inicial;

            doc.setFontSize(18);
            doc.text(letraAtual, 10, y);
            y += 10;
        }

        doc.setFontSize(12);
        doc.text(capitalizar(palavra) + " — " + dicionario.get(palavra), 15, y);

        y += 8;

        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save("dicionario.pdf");
});

// =========================
//   IMPORTAR EXCEL
// =========================

btnImportar.addEventListener("click", () => {
    modalInfoImportar.style.display = "flex";
});

document.querySelectorAll(".fecharInfoImportar").forEach(btn => {
    btn.addEventListener("click", () => modalInfoImportar.style.display = "none");
});

confirmarImportar.addEventListener("click", () => {
    modalInfoImportar.style.display = "none";
    document.getElementById("inputImportar").click();
});

document.getElementById("inputImportar").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        json.forEach(row => {
            if (row.Palavra && row.Significado) {
                dicionario.set(row.Palavra.toLowerCase(), row.Significado);
            }
        });

        salvarLocalStorage();
        atualizarLista();
        alert("Importação concluída!");
    };

    reader.readAsArrayBuffer(file);
});

// =========================
//   MODO ESCURO
// =========================

btnModoEscuro.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        btnModoEscuro.innerHTML = '<i class="fa-solid fa-sun"></i> Sair do Modo Escuro';
    } else {
        btnModoEscuro.innerHTML = '<i class="fa-solid fa-moon"></i> Modo Escuro';
    }
});

// =========================
//   LOGOFF
// =========================

btnLogoff.addEventListener("click", () => {
    modalLogoff.style.display = "flex";
});

document.querySelectorAll(".fecharLogoff").forEach(btn => {
    btn.addEventListener("click", () => modalLogoff.style.display = "none");
});

confirmarLogoff.addEventListener("click", () => {
    modalLogoff.style.display = "none";
    telaLogin.style.display = "flex";
    formLogin.classList.add("hidden");
    usuarioTipo = null;
    usuarioAtual = null;
    btnLogoff.classList.add("hidden");
    atualizarLista();
});

// =========================
//   BOTÃO VOLTAR AO TOPO
// =========================

document.getElementById("topo").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Inicializa lista
atualizarLista();
