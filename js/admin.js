// ✅ MANTER ACESSO SALVO — Se já entrou, continua logado!
const CHAVE_ACESSO = "adminAcessoLiberado";

// ✅ AO CARREGAR A PÁGINA — SÓ LIBERA SE JÁ TINHA ENTRADO
if (localStorage.getItem(CHAVE_ACESSO) === "SIM") {
    acessoLiberado = true;
    document.getElementById('btnLimparParticipantes').classList.remove('escondido');
    document.getElementById('btnLimparApoiadores').classList.remove('escondido');
    document.getElementById('botaoEntrarArea').classList.add('escondido');
    document.getElementById('botaoSairArea').classList.remove('escondido');
    carregarTodasMensagensAdmin(); // ✅ SÓ CARREGA PAINEL SE FOR ADMIN
}

function sairAreaAdministrativa() {
    if (!confirm("⚠️ Tem certeza que deseja sair da Área Administrativa?")) return;
    acessoLiberado = false;
    localStorage.removeItem(CHAVE_ACESSO); // ✅ APAGA O ACESSO

    // ✅ ESCONDE TUDO DE ADMIN
    document.getElementById('btnLimparParticipantes').classList.add('escondido');
    document.getElementById('btnLimparApoiadores').classList.add('escondido');
    document.getElementById('botaoEntrarArea').classList.remove('escondido');
    document.getElementById('botaoSairArea').classList.add('escondido');

    // ✅ REMOVE O PAINEL DE MENSAGENS — SAI DA TELA
    const painel = document.getElementById('painel-mensagens-admin');
    if (painel) painel.remove();

    alert("✅ Você saiu da Área Administrativa!");

    // ✅ RECARREGA AS LISTAS SEM BOTÕES DE EXCLUIR
    carregarParticipantes();
    carregarApoiadores();
}

function abrirModalSenha() {
    document.getElementById('modalSenha').classList.remove('escondido');
    document.getElementById('campoSenha').value = '';
    document.getElementById('avisoErro').classList.add('escondido');
}

function fecharModalSenha() {
    document.getElementById('modalSenha').classList.add('escondido');
}

function verificarSenha() {
    const senhaDigitada = document.getElementById('campoSenha').value.trim();
    
    if (senhaDigitada === SENHA_ADMIN) {
        acessoLiberado = true;
        localStorage.setItem(CHAVE_ACESSO, "SIM"); // ✅ SALVA O ACESSO

        fecharModalSenha();

        // ✅ MOSTRA TUDO DE ADMIN
        document.getElementById('btnLimparParticipantes').classList.remove('escondido');
        document.getElementById('btnLimparApoiadores').classList.remove('escondido');
        document.getElementById('botaoEntrarArea').classList.add('escondido');
        document.getElementById('botaoSairArea').classList.remove('escondido');

        carregarParticipantes();
        carregarApoiadores();
        carregarTodasMensagensAdmin(); // ✅ ABRE PAINEL SÓ PARA VOCÊ

        alert("🔓 Acesso liberado! Você pode responder ou enviar mensagens!");
    } else {
        document.getElementById('avisoErro').classList.remove('escondido');
        document.getElementById('campoSenha').value = '';
    }
}

// ✅ INICIA AS LISTAS — SEM BOTÕES DE EXCLUIR PARA O PÚBLICO
carregarParticipantes();
carregarApoiadores();
