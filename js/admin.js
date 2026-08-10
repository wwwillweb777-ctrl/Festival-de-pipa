function abrirModalSenha() {
    document.getElementById('modalSenha').classList.remove('escondido');
    document.getElementById('campoSenha').value = '';
    document.getElementById('avisoErro').classList.add('escondido');
}
function fecharModalSenha() { document.getElementById('modalSenha').classList.add('escondido'); }
function verificarSenha() {
    const senha = document.getElementById('campoSenha').value.trim();
    if (senha === SENHA_ADMIN) {
        acessoLiberado = true;
        fecharModalSenha();
        document.getElementById('btnLimparParticipantes').classList.remove('escondido');
        document.getElementById('btnLimparApoiadores').classList.remove('escondido');
        document.getElementById('botaoEntrarArea').classList.add('escondido');
        document.getElementById('botaoSairArea').classList.remove('escondido');
        carregarParticipantes();
        carregarApoiadores();
        carregarTodasMensagensAdmin();
        alert("🔓 Acesso liberado!");
    } else {
        document.getElementById('avisoErro').classList.remove('escondido');
        document.getElementById('campoSenha').value = '';
        document.getElementById('campoSenha').focus();
    }
}
function sairAreaAdministrativa() {
    if (!confirm("⚠️ Tem certeza?")) return;
    acessoLiberado = false;
    document.getElementById('btnLimparParticipantes').classList.add('escondido');
    document.getElementById('btnLimparApoiadores').classList.add('escondido');
    document.getElementById('botaoEntrarArea').classList.remove('escondido');
    document.getElementById('botaoSairArea').classList.add('escondido');
    const painel = document.getElementById('painel-mensagens-admin');
    if (painel) painel.remove();
    alert("✅ Você saiu!");
    carregarParticipantes();
    carregarApoiadores();
}
function fecharModalResposta() {
    document.getElementById('modalResposta').classList.add('escondido');
    document.getElementById('textoResposta').value = '';
}
async function abrirModalResponderMensagem(chave, dados) {
    document.getElementById('tituloModalResposta').textContent = "🔐 Responder Mensagem";
    document.getElementById('remetenteMensagem').textContent = dados.nomeRemetente || "Sem nome";
    document.getElementById('chaveMensagemAtual').value = chave;
    document.getElementById('idDestinatario').value = dados.idRemetente;
    document.getElementById('nomeDestinatario').value = dados.nomeRemetente || "Visitante";
    document.getElementById('textoResposta').value = dados.resposta || "";
    document.getElementById('modalResposta').classList.remove('escondido');
}
async function abrirModalMensagemNova(idPessoa, nomePessoa) {
    document.getElementById('tituloModalResposta').textContent = "✉️ Enviar Mensagem Nova";
    document.getElementById('remetenteMensagem').textContent = nomePessoa;
    document.getElementById('chaveMensagemAtual').value = "";
    document.getElementById('idDestinatario').value = idPessoa;
    document.getElementById('nomeDestinatario').value = nomePessoa;
    document.getElementById('textoResposta').value = "";
    document.getElementById('modalResposta').classList.remove('escondido');
}
async function enviarResposta() {
    const chave = document.getElementById('chaveMensagemAtual').value;
    const idDest = document.getElementById('idDestinatario').value;
    const nomeDest = document.getElementById('nomeDestinatario').value;
    const texto = document.getElementById('textoResposta').value.trim();
    if (!texto) { alert("⚠️ Escreva sua mensagem!"); return; }
    if (!idDest) { alert("❌ Destinatário não identificado!"); return; }
    try {
        if (chave) {
            await db.ref("festival_pipas/mensagens/" + chave).update({
                resposta: texto, dataResposta: dataAtual()
            });
            alert("✅ Resposta enviada para " + nomeDest + "!");
        } else {
            await db.ref("festival_pipas/mensagens").push({
                idRemetente: idDest,
                nomeRemetente: nomeDest,
                texto: "📩 Mensagem de: " + NOME_REMETENTE_ADMIN + "\n" + texto,
                data: dataAtual(),
                resposta: texto,
                dataResposta: dataAtual()
            });
            alert("✅ Mensagem enviada para " + nomeDest + "!");
        }
        fecharModalResposta();
    } catch (e) { alert("❌ Erro: " + e.message); }
}
async function excluirMensagem(chave) {
    if (!confirm("⚠️ Tem certeza?")) return;
    await db.ref("festival_pipas/mensagens/" + chave).remove();
    alert("✅ Excluída!");
}
async function limparTodasMensagens() {
    if (!confirm("⚠️ TEM CERTEZA?")) return;
    await db.ref("festival_pipas/mensagens").remove();
    alert("✅ Todas apagadas!");
}
function carregarTodasMensagensAdmin() {
    db.ref("festival_pipas/mensagens").on("value", (snap) => {
        if (!document.getElementById('painel-mensagens-admin')) {
            const container = document.createElement('div');
            container.id = 'painel-mensagens-admin';
            container.className = 'mt-8 bg-white rounded-2xl sombra-card p-6';
            container.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold text-admin flex items-center gap-2">
                        <i class="fa fa-comments"></i> Mensagens Recebidas
                    </h2>
                    <button onclick="limparTodasMensagens()" class="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
                        🗑️ Apagar Todas
                    </button>
                </div>
                <div id="lista-mensagens-admin" class="space-y-4 max-h-[600px] overflow-y-auto"></div>
            `;
            document.querySelector('main').appendChild(container);
        }
        const lista = document.getElementById('lista-mensagens-admin');
        lista.innerHTML = '';
        let temMensagem = false;
        snap.forEach((item) => {
            temMensagem = true;
            const chave = item.key;
            const dados = item.val();
            const nomePessoa = dados.nomeRemetente || "Visitante";
            const idPessoa = dados.idRemetente || "";
            const status = dados.resposta
                ? '<span class="text-green-600 text-sm font-medium">✅ Respondida</span>'
                : '<span class="text-red-500 text-sm font-bold">⏳ Pendente</span>';
            lista.innerHTML += `
                <div class="p-4 border rounded-xl ${dados.resposta ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-lg">📩 Mensagem de ${nomePessoa}</span>
                        ${status}
                    </div>
                    <p class="text-gray-800 mb-2">${dados.texto}</p>
                    <p class="text-sm text-gray-500 mb-3">📅 ${dados.data}</p>
                    ${dados.resposta ? `
                        <div class="bg-green-100 p-3 rounded-lg mb-3">
                            <p class="text-sm font-semibold text-green-800 mb-1">📩 Sua Resposta:</p>
                            <p class="text-green-900">${dados.resposta}</p>
                            ${dados.dataResposta ? `<p class="text-xs text-green-600 mt-1">${dados.dataResposta}</p>` : ''}
                        </div>
                    ` : ''}
                    <div class="flex flex-wrap gap-2 mt-2">
                        <button onclick='abrirModalResponderMensagem("${chave}", ${JSON.stringify(dados).replace(/'/g, "\\'")})' 
                            class="px-3 py-2 rounded-lg text-white text-sm font-medium bg-admin">
                            ${dados.resposta ? '✏️ Editar Resposta' : '✍️ Responder'}
                        </button>
                        <button onclick='abrirModalMensagemNova("${idPessoa}", "${nomePessoa.replace(/"/g, '&quot;')}")' 
                            class="px-3 py-2 rounded-lg text-white text-sm font-medium bg-primario">
                            ✉️ Mensagem Nova
                        </button>
                        <button onclick="excluirMensagem('${chave}')" 
                            class="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            `;
        });
        if (!temMensagem) {
            lista.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhuma mensagem recebida ainda 💬</p>';
        }
    });
}
