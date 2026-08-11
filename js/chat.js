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
