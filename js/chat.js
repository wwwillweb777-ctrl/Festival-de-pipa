let nomeUsuarioChat = "";
let ultimaRespostaRecebida = null;

function abrirChat() {
    const modal = document.getElementById('modalChat');
    if (modal) modal.classList.remove('escondido');
    const passoNome = document.getElementById('passoNome');
    const passoMsg = document.getElementById('passoMensagem');
    if (passoNome) passoNome.classList.remove('escondido');
    if (passoMsg) passoMsg.classList.add('escondido');
    const nomeChat = document.getElementById('nomeChat');
    const campoMsg = document.getElementById('campoMensagem');
    if (nomeChat) nomeChat.value = '';
    if (campoMsg) campoMsg.value = '';
    nomeUsuarioChat = "";
    carregarMensagensDoChat();
}

function fecharChat() {
    const modal = document.getElementById('modalChat');
    if (modal) modal.classList.add('escondido');
}

function confirmarNome() {
    const nomeChat = document.getElementById('nomeChat');
    if (!nomeChat) return;
    const nome = nomeChat.value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }
    nomeUsuarioChat = nome;
    const nomeExibido = document.getElementById('nomeExibido');
    const passoNome = document.getElementById('passoNome');
    const passoMsg = document.getElementById('passoMensagem');
    if (nomeExibido) nomeExibido.textContent = nome;
    if (passoNome) passoNome.classList.add('escondido');
    if (passoMsg) passoMsg.classList.remove('escondido');
}

async function enviarMensagem() {
    const campoMsg = document.getElementById('campoMensagem');
    if (!campoMsg) return;
    const texto = campoMsg.value.trim();
    if (!texto) { alert("⚠️ Escreva sua mensagem!"); return; }
    if (!nomeUsuarioChat) { alert("⚠️ Digite seu nome primeiro!"); return; }
    try {
        await db.ref("festival_pipas/mensagens").push({
            idRemetente: ID_VISITANTE,
            nomeRemetente: nomeUsuarioChat,
            texto: texto,
            data: dataAtual(),
            resposta: null,
            dataResposta: null
        });
        campoMsg.value = '';
        
        // ✅ Confirmação para quem mandou
        adicionarNotificacao('mensagem', '💬 Mensagem Enviada!', `${nomeUsuarioChat}, sua mensagem foi enviada!`);
        
        // ✅ NOTIFICAÇÃO PARA VOCÊ (DONO)
        adicionarNotificacao('mensagem', '💬 NOVA MENSAGEM RECEBIDA!', `${nomeUsuarioChat} escreveu: "${texto}"`);
        
    } catch (e) { alert("❌ Erro: " + e.message); }
}

function carregarMensagensDoChat() {
    const area = document.getElementById('areaMensagens');
    if (!area) return;
    db.ref("festival_pipas/mensagens")
        .orderByChild("idRemetente")
        .equalTo(ID_VISITANTE)
        .on("value", (snap) => {
            area.innerHTML = '';
            let temMensagem = false;
            snap.forEach((item) => {
                temMensagem = true;
                const m = item.val();
                area.innerHTML += `
                    <div class="mensagem mensagem-me px-4 py-2 mb-1">
                        <p class="font-medium text-sm">${m.nomeRemetente}</p>
                        <p>${m.texto}</p>
                        <p class="text-xs opacity-70 mt-1">${m.data}</p>
                    </div>
                `;
                if (m.resposta && m.dataResposta !== ultimaRespostaRecebida) {
                    ultimaRespostaRecebida = m.dataResposta;
                    adicionarNotificacao('resposta', '📩 Você recebeu uma resposta!', `${NOME_REMETENTE_ADMIN} respondeu sua mensagem!`);
                }
                if (m.resposta) {
                    area.innerHTML += `
                        <div class="mensagem mensagem-resposta px-4 py-2 mb-1">
                            <p class="font-semibold text-sm text-green-700 mb-1">📩 Resposta de: ${NOME_REMETENTE_ADMIN}</p>
                            <p>${m.resposta}</p>
                            <p class="text-xs opacity-70 mt-1">${m.dataResposta || ''}</p>
                        </div>
                    `;
                }
            });
            if (!temMensagem) {
                area.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">Olá! Digite seu nome e depois sua mensagem!</p>';
            }
            area.scrollTop = area.scrollHeight;
        });
}
