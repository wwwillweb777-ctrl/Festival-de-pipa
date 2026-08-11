async function salvarParticipante() {
    const nome = document.getElementById('nomeParticipante').value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }
    try {
        await db.ref("festival_pipas/participantes").push({ nome, data: dataAtual() });
        document.getElementById('nomeParticipante').value = '';
        adicionarNotificacao('participante', '🪁 Novo Participante!', `${nome} acabou de se inscrever!`);
        alert("✅ Obrigado! Inscrição feita! 🪁");
    } catch (e) { alert("❌ Erro: " + e.message); }
}

async function salvarApoiador() {
    const nome = document.getElementById('nomeApoiador').value.trim();
    const oferta = document.getElementById('ofertaApoio').value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }
    if (!oferta) { alert("⚠️ Digite o que você oferece!"); return; }
    try {
        await db.ref("festival_pipas/apoiadores").push({ nome, oferta, data: dataAtual() });
        document.getElementById('nomeApoiador').value = '';
        document.getElementById('ofertaApoio').value = '';
        adicionarNotificacao('apoiador', '⭐ Novo Apoiador!', `${nome} quer apoiar o evento!`);
        alert("✅ Agradecemos o apoio! ⭐");
    } catch (e) { alert("❌ Erro: " + e.message); }
}
