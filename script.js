// =========================
//   LOCALSTORAGE
// =========================

let dicionario = new Map(JSON.parse(localStorage.getItem("dicionario")) || []);
let adminSenha = localStorage.getItem("adminSenha");

const listaPalavras = document.getElementById("listaPalavras");
const contador = document.getElementById("contadorPalavras");

// Modais
const modalSenha = document.getElementById("modalSenha");
const inputSenha = document.getElementById("inputSenha");
const confirmarSenha = document.getElementById("confirmarSenha");
const resetarSenha = document.getElementById("resetarSenha");
const fecharSenha = document.querySelector(".fecharSenha");

const modalResultado = document.getElementById("modalResultado");
const conteudoResultado = document.getElementById("conteudoResultado");
const fecharResultado = document.getElementById("fecharResultado");

const modalInfoExportar = document.getElementById("modalInfoExportar");
const modalInfoImportar = document.getElementById("modalInfoImportar");

const confirmarExportar = document.getElementById("confirmarExportar");
const confirmarImportar = document.getElementById("confirmarImportar");

let acaoSenha = null;
let palavraAlvo = null;

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

function abrirModalSenha(acao, palavra = null) {
    acaoSenha = acao;
    palavraAlvo = palavra;
    inputSenha.value = "";

    if (acao === "redefinir") {
        confirmarSenha.textContent = "Redefinir Senha";
        resetarSenha.classList.remove("hidden-reset");
    } else {
        confirmarSenha.textContent = "Confirmar";
        resetarSenha.classList.add("hidden-reset");
    }

    modalSenha.style.display = "flex";
}

function fecharModalSenha() {
    modalSenha.style.display = "none";
}

// =========================
//   VALIDAÇÃO DE SENHA
// =========================

function validarSenha() {
    const senha = inputSenha.value.trim();

    if (senha.length === 0) {
        alert("Digite uma senha.");
        return false;
    }

    if (!adminSenha) {
        if (senha.length < 3) {
            alert("A senha deve ter pelo menos 3 caracteres.");
            return false;
        }

        adminSenha = senha;
        localStorage.setItem("adminSenha", adminSenha);
        alert("Senha criada com sucesso!");
        return true;
    }

    if (senha === adminSenha) {
        return true;
    }

    alert("Senha incorreta.");
    return false;
}

// =========================
//   LISTA DE PALAVRAS
// =========================

function atualizarLista() {
    listaPalavras.innerHTML = "";

    [...dicionario.keys()].sort().forEach((chave) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <span class="palavra-item">${capitalizar(chave)}</span>
            <button class="btn-excluir">×</button>
        `;

        li.querySelector(".palavra-item").addEventListener("click", () => {
            document.getElementById("busca").value = chave;
            document.getElementById("formBusca").dispatchEvent(new Event("submit"));
        });

        li.querySelector(".btn-excluir").addEventListener("click", () => {
            abrirModalSenha("excluir", chave);
        });

        listaPalavras.appendChild(li);
    });

    atualizarContador();
}

// =========================
//   CADASTRO
// =========================

document.getElementById("formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();
    abrirModalSenha("cadastrar");
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
//   CONFIRMAR SENHA
// =========================

confirmarSenha.addEventListener("click", () => {
    if (!validarSenha()) return;

    if (acaoSenha === "cadastrar") {
        let palavra = document.getElementById("palavra").value.trim().toLowerCase();
        let definicao = document.getElementById("definicao").value.trim();

        dicionario.set(palavra, definicao);
        salvarLocalStorage();
        atualizarLista();
        document.getElementById("formCadastro").reset();
    }

    if (acaoSenha === "excluir") {
        dicionario.delete(palavraAlvo);
        salvarLocalStorage();
        atualizarLista();
    }

    if (acaoSenha === "redefinir") {
        let novaSenha = prompt("Digite a nova senha:");

        if (!novaSenha || novaSenha.trim().length < 3) {
            alert("A nova senha deve ter pelo menos 3 caracteres.");
            return;
        }

        adminSenha = novaSenha.trim();
        localStorage.setItem("adminSenha", adminSenha);
        alert("Senha redefinida com sucesso!");
    }

    fecharModalSenha();
});

// =========================
//   RESETAR SENHA (SEM VALIDAR)
// =========================

resetarSenha.addEventListener("click", () => {

    alert("⚠ Esta ação está liberada sem senha apenas porque esta é uma versão de TESTE, caso contrário, um e-mail com orientações seria enviado a você.");

    adminSenha = null;
    localStorage.removeItem("adminSenha");

    alert("Senha resetada! Uma nova senha será solicitada na próxima operação protegida.");

    fecharModalSenha();
});

// =========================
//   MODO ESCURO
// =========================

const btnModoEscuro = document.getElementById("btnModoEscuro");

btnModoEscuro.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        btnModoEscuro.innerHTML = '<i class="fa-solid fa-sun"></i> Sair do Modo Escuro';
    } else {
        btnModoEscuro.innerHTML = '<i class="fa-solid fa-moon"></i> Modo Escuro';
    }
});

// =========================
//   EXPORTAR PDF
// =========================

document.getElementById("btnExportar").addEventListener("click", () => {
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

document.getElementById("btnImportar").addEventListener("click", () => {
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
//   REDEFINIR SENHA
// =========================

document.getElementById("btnRedefinirSenha").addEventListener("click", () => {
    abrirModalSenha("redefinir");
});

// =========================
//   BOTÃO VOLTAR AO TOPO
// =========================

document.getElementById("topo").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Inicializa lista
atualizarLista();
