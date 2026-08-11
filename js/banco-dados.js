async function salvarParticipante() {
    const nome = document.getElementById('nomeParticipante').value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }
    try {
        await db.ref("festival_pipas/participantes").push({ nome, data: dataAtual() });
        
        // ✅ NOTIFICAÇÃO SALVA NO BANCO — VOCÊ RECEBE!
        await db.ref("festival_pipas/notificacoes").push({
            tipo: 'participante',
            titulo: '🪁 Novo Participante!',
            mensagem: `${nome} acabou de se inscrever!`,
            data: dataAtual(),
            lida: false
        });
        
        document.getElementById('nomeParticipante').value = '';
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
        
        // ✅ NOTIFICAÇÃO SALVA NO BANCO — VOCÊ RECEBE!
        await db.ref("festival_pipas/notificacoes").push({
            tipo: 'apoiador',
            titulo: '⭐ Novo Apoiador!',
            mensagem: `${nome} quer apoiar o evento!`,
            data: dataAtual(),
            lida: false
        });
        
        document.getElementById('nomeApoiador').value = '';
        document.getElementById('ofertaApoio').value = '';
        alert("✅ Agradecemos o apoio! ⭐");
    } catch (e) { alert("❌ Erro: " + e.message); }
}

async function excluirParticipante(chave) { if(!confirm("⚠️ Tem certeza?")) return; await db.ref("festival_pipas/participantes/"+chave).remove(); alert("✅ Excluído!"); }
async function excluirApoiador(chave) { if(!confirm("⚠️ Tem certeza?")) return; await db.ref("festival_pipas/apoiadores/"+chave).remove(); alert("✅ Excluído!"); }
async function limparTodosParticipantes() { if(!confirm("⚠️ TEM CERTEZA?")) return; await db.ref("festival_pipas/participantes").remove(); alert("✅ Todos apagados!"); }
async function limparTodosApoiadores() { if(!confirm("⚠️ TEM CERTEZA?")) return; await db.ref("festival_pipas/apoiadores").remove(); alert("✅ Todos apagados!"); }

function carregarParticipantes() {
    db.ref("festival_pipas/participantes").on("value", snap => {
        const lista = document.getElementById('listaParticipantes');
        const qtd = document.getElementById('qtdParticipantes');
        const btnLimpar = document.getElementById('btnLimparParticipantes');
        lista.innerHTML = ''; let contador = 0;
        snap.forEach(item => {
            const d = item.val(); contador++;
            const del = acessoLiberado ? `<button onclick="excluirParticipante('${item.key}')" class="text-red-500 ml-2 text-sm">❌</button>` : '';
            lista.innerHTML += `<div class="p-2 bg-green-50 rounded flex justify-between items-center"><span class="text-sm">🪁 ${d.nome}</span>${del}</div>`;
        });
        qtd.textContent = contador;
        if (acessoLiberado && btnLimpar) btnLimpar.classList.remove('escondido');
        if (contador === 0) lista.innerHTML = '<p class="text-gray-400 text-center py-6">Nenhum participante ainda 🪁</p>';
    });
}

function carregarApoiadores() {
    db.ref("festival_pipas/apoiadores").on("value", snap => {
        const lista = document.getElementById('listaApoiadores');
        const qtd = document.getElementById('qtdApoiadores');
        const btnLimpar = document.getElementById('btnLimparApoiadores');
        lista.innerHTML = ''; let contador = 0;
        snap.forEach(item => {
            const d = item.val(); contador++;
            const del = acessoLiberado ? `<button onclick="excluirApoiador('${item.key}')" class="text-red-500 ml-2 text-sm">❌</button>` : '';
            lista.innerHTML += `<div class="p-2 bg-amber-50 rounded flex justify-between items-center"><span class="text-sm">⭐ ${d.nome}</span>${del}</div>`;
        });
        qtd.textContent = contador;
        if (acessoLiberado && btnLimpar) btnLimpar.classList.remove('escondido');
        if (contador === 0) lista.innerHTML = '<p class="text-gray-400 text-center py-6">Nenhum apoiador ainda ⭐</p>';
    });
}

window.onload = function() {
    carregarParticipantes();
    carregarApoiadores();
};
