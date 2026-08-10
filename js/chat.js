let nomeUsuarioChat = "";
let ultimaRespostaRecebida = null;

function abrirChat() {
    document.getElementById('modalChat').classList.remove('escondido');
    document.getElementById('passoNome').classList.remove('escondido');
    document.getElementById('passoMensagem').classList.add('escondido');
    document.getElementById('nomeChat').value = '';
    document.getElementById('campoMensagem').value = '';
    nomeUsuarioChat = "";
    carregarMensagensDoChat();
}
function fecharChat() { document.getElementById('modalChat').classList.add('escondido'); }
function confirmarNome() {
    const nome = document.getElementById('nomeChat').value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }
    nomeUsuarioChat = nome;
    document.getElementById('nomeExibido').textContent = nome;
    document.getElementById('passoNome').classList.add('escondido');
    document.getElementById('passoMensagem').classList.remove('escondido');
}
async function enviarMensagem() {
    const texto = document.getElementById('campoMensagem').value.trim();
    if (!texto) { alert("⚠️ Escreva sua mensagem!"); return; }
    if (!nomeUsuarioChat) { alert("⚠️ Digite seu nome primeiro!"); return; }
    try {
        await db.ref("festival_pipas/mensagens").push({
            idRemetente: ID_VISITANTE, nomeRemetente: nomeUsuarioChat, texto,
            data: dataAtual(), resposta: null, dataResposta: null
        });
        document.getElementById('campoMensagem').value = '';
        adicionarNotificacao('mensagem', '💬 Mensagem Enviada!', `${nomeUsuarioChat}, sua mensagem foi enviada!`);
    } catch (e) { alert("❌ Erro: " + e.message); }
}
function carregarMensagensDoChat() {
    const area = document.getElementById('areaMensagens');
    db.ref("festival_pipas/mensagens").orderByChild("idRemetente").equalTo(ID_VISITANTE).on("value", snap => {
        area.innerHTML = ''; let tem = false;
        snap.forEach(item => {
            tem = true; const m = item.val();
            area.innerHTML += `<div class="mensagem mensagem-me px-4 py-2 mb-1"><p class="font-medium text-sm">${m.nomeRemetente}</p><p>${m.texto}</p><p class="text-xs opacity-70 mt-1">${m.data}</p></div>`;
            if (m.resposta && m.dataResposta !== ultimaRespostaRecebida) {
                ultimaRespostaRecebida = m.dataResposta;
                adicionarNotificacao('resposta', '📩 Você recebeu uma resposta!', `${NOME_REMETENTE_ADMIN} respondeu sua mensagem!`);
            }
            if (m.resposta) {
                area.innerHTML += `<div class="mensagem mensagem-resposta px-4 py-2 mb-1"><p class="font-semibold text-sm text-green-700 mb-1">📩 Resposta de: ${NOME_REMETENTE_ADMIN}</p><p>${m.resposta}</p><p class="text-xs opacity-70 mt-1">${m.dataResposta||''}</p></div>`;
            }
        });
        if (!tem) area.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">Olá! Digite seu nome e depois sua mensagem!</p>';
        area.scrollTop = area.scrollHeight;
    });
}
