function sairAreaAdministrativa() {
    if (!confirm("⚠️ Tem certeza que deseja sair da Área Administrativa?")) return;
    acessoLiberado = false;
    document.getElementById('btnLimparParticipantes').classList.add('escondido');
    document.getElementById('btnLimparApoiadores').classList.add('escondido');
    document.getElementById('botaoEntrarArea').classList.remove('escondido');
    document.getElementById('botaoSairArea').classList.add('escondido');
    const painel = document.getElementById('painel-mensagens-admin');
    if (painel) painel.remove();
    alert("✅ Você saiu da Área Administrativa!");
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
        fecharModalSenha();
        document.getElementById('btnLimparParticipantes').classList.remove('escondido');
        document.getElementById('btnLimparApoiadores').classList.remove('escondido');
        document.getElementById('botaoEntrarArea').classList.add('escondido');
        document.getElementById('botaoSairArea').classList.remove('escondido');
        carregarParticipantes();
        carregarApoiadores();
        carregarTodasMensagensAdmin();
        alert("🔓 Acesso liberado! Você pode responder ou enviar mensagens individuais!");
    } else {
        document.getElementById('avisoErro').classList.remove('escondido');
        document.getElementById('campoSenha').value = '';
    }
}

carregarParticipantes();
carregarApoiadores();
