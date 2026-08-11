async function salvarParticipante() {
    const nome = document.getElementById('nomeParticipante').value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }
    try {
        await db.ref("festival_pipas/participantes").push({ nome: nome, data: dataAtual() });
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
        await db.ref("festival_pipas/apoiadores").push({ nome: nome, oferta: oferta, data: dataAtual() });
        document.getElementById('nomeApoiador').value = '';
        document.getElementById('ofertaApoio').value = '';
        alert("✅ Agradecemos o apoio! ⭐");
    } catch (e) { alert("❌ Erro: " + e.message); }
}

async function excluirParticipante(chave) {
    if (!confirm("⚠️ Tem certeza que deseja excluir este participante?")) return;
    await db.ref("festival_pipas/participantes/" + chave).remove();
    alert("✅ Excluído com sucesso!");
}

async function excluirApoiador(chave) {
    if (!confirm("⚠️ Tem certeza que deseja excluir este apoiador?")) return;
    await db.ref("festival_pipas/apoiadores/" + chave).remove();
    alert("✅ Excluído com sucesso!");
}

async function limparTodosParticipantes() {
    if (!confirm("⚠️⚠️⚠️ TEM CERTEZA? Isso vai APAGAR TODOS os participantes!")) return;
    await db.ref("festival_pipas/participantes").remove();
    alert("✅ Todos os participantes foram apagados!");
}

async function limparTodosApoiadores() {
    if (!confirm("⚠️⚠️⚠️ TEM CERTEZA? Isso vai APAGAR TODOS os apoiadores!")) return;
    await db.ref("festival_pipas/apoiadores").remove();
    alert("✅ Todos os apoiadores foram apagados!");
}

function carregarParticipantes() {
    db.ref("festival_pipas/participantes").on("value", (snap) => {
        const lista = document.getElementById('listaParticipantes');
        const qtd = document.getElementById('qtdParticipantes');
        lista.innerHTML = '';
        let contador = 0;
        snap.forEach((item) => {
            const dados = item.val();
            const chave = item.key;
            contador++;
            const botaoExcluir = acessoLiberado ? `<button onclick="excluirParticipante('${chave}')" class="text-red-500 ml-2 text-sm">❌</button>` : '';
            lista.innerHTML += `<div class="p-2 bg-green-50 rounded flex justify-between items-center"><span class="text-sm">🪁 ${dados.nome}</span>${botaoExcluir}</div>`;
        });
        qtd.textContent = contador;
        if (contador === 0) lista.innerHTML = '<p class="text-gray-400 text-center py-6">Nenhum participante ainda 🪁</p>';
    });
}

function carregarApoiadores() {
    db.ref("festival_pipas/apoiadores").on("value", (snap) => {
        const lista = document.getElementById('listaApoiadores');
        const qtd = document.getElementById('qtdApoiadores');
        lista.innerHTML = '';
        let contador = 0;
        snap.forEach((item) => {
            const dados = item.val();
            const chave = item.key;
            contador++;
            const botaoExcluir = acessoLiberado ? `<button onclick="excluirApoiador('${chave}')" class="text-red-500 ml-2 text-sm">❌</button>` : '';
            lista.innerHTML += `<div class="p-2 bg-amber-50 rounded flex justify-between items-center"><span class="text-sm">⭐ ${dados.nome}</span>${botaoExcluir}</div>`;
        });
        qtd.textContent = contador;
        if (contador === 0) lista.innerHTML = '<p class="text-gray-400 text-center py-6">Nenhum apoiador ainda ⭐</p>';
    });
}
