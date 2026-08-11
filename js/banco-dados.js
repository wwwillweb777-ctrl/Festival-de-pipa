// ✅ SALVAR PARTICIPANTE
async function salvarParticipante() {
    const nome = document.getElementById('nomeParticipante').value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }

    try {
        await db.ref("festival_pipas/participantes").push({
            nome: nome,
            data: dataAtual()
        });
        document.getElementById('nomeParticipante').value = '';
        alert("✅ Obrigado pela participação!");
    } catch (e) {
        alert("❌ Erro: " + e.message);
    }
}

// ✅ CARREGAR PARTICIPANTES
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
            const botaoExcluir = acessoLiberado ? 
                `<button onclick="excluirParticipante('${chave}')" class="text-red-500 ml-2 text-sm">❌</button>` : '';

            lista.innerHTML += `
                <div class="p-2 bg-green-50 rounded flex justify-between items-center">
                    <span class="text-green-800">🪁 ${dados.nome}</span>
                    ${botaoExcluir}
                </div>
            `;
        });

        qtd.textContent = contador;
        if (contador === 0) {
            lista.innerHTML = '<p class="text-gray-400 text-center py-6">Nenhum participante ainda 🪁</p>';
        }
    });
}

// ✅ EXCLUIR UM PARTICIPANTE
async function excluirParticipante(chave) {
    if (!acessoLiberado) return;
    if (!confirm("⚠️ Excluir este participante?")) return;
    await db.ref("festival_pipas/participantes/" + chave).remove();
    alert("✅ Excluído!");
}

// ✅ LIMPAR TODOS OS PARTICIPANTES
async function limparTodosParticipantes() {
    if (!acessoLiberado) return;
    if (!confirm("⚠️⚠️ TEM CERTEZA? Apagar TODOS os participantes?")) return;
    await db.ref("festival_pipas/participantes").remove();
    alert("✅ Todos foram apagados!");
}

// ✅ SALVAR APOIADOR
async function salvarApoiador() {
    const nome = document.getElementById('nomeApoiador').value.trim();
    const oferta = document.getElementById('ofertaApoio').value.trim();
    if (!nome) { alert("⚠️ Digite seu nome!"); return; }

    try {
        await db.ref("festival_pipas/apoiadores").push({
            nome: nome,
            oferta: oferta || "Não informou",
            data: dataAtual()
        });
        document.getElementById('nomeApoiador').value = '';
        document.getElementById('ofertaApoio').value = '';
        alert("✅ Agradecemos seu apoio!");
    } catch (e) {
        alert("❌ Erro: " + e.message);
    }
}

// ✅ CARREGAR APOIADORES — MOSTRA NOME + O QUE OFERECE
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
            const botaoExcluir = acessoLiberado ? 
                `<button onclick="excluirApoiador('${chave}')" class="text-red-500 ml-2 text-sm">❌</button>` : '';

            lista.innerHTML += `
                <div class="p-3 bg-amber-50 rounded flex flex-col gap-1">
                    <div class="flex justify-between items-center">
                        <span class="font-medium">⭐ ${dados.nome}</span>
                        ${botaoExcluir}
                    </div>
                    <p class="text-sm text-amber-800 bg-amber-100 p-2 rounded">🤝 Oferece: ${dados.oferta || 'Não informado'}</p>
                </div>
            `;
        });

        qtd.textContent = contador;
        if (contador === 0) {
            lista.innerHTML = '<p class="text-gray-400 text-center py-6">Nenhum apoiador ainda ⭐</p>';
        }
    });
}

// ✅ EXCLUIR UM APOIADOR
async function excluirApoiador(chave) {
    if (!acessoLiberado) return;
    if (!confirm("⚠️ Excluir este apoiador?")) return;
    await db.ref("festival_pipas/apoiadores/" + chave).remove();
    alert("✅ Excluído!");
}

// ✅ LIMPAR TODOS OS APOIADORES
async function limparTodosApoiadores() {
    if (!acessoLiberado) return;
    if (!confirm("⚠️⚠️ TEM CERTEZA? Apagar TODOS os apoiadores?")) return;
    await db.ref("festival_pipas/apoiadores").remove();
    alert("✅ Todos foram apagados!");
}

// ✅ INICIA TUDO QUANDO A PÁGINA CARREGA
carregarParticipantes();
carregarApoiadores();
