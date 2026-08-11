// ✅ CHAT DO USUÁRIO — SÓ VÊ AS PRÓPRIAS MENSAGENS E RESPOSTAS

function abrirChat() {
    document.getElementById('modalChat').classList.remove('escondido');
    document.getElementById('passoNome').classList.remove('escondido');
    document.getElementById('passoMensagem').classList.add('escondido');
    document.getElementById('nomeChat').value = '';
    document.getElementById('campoMensagem').value = '';
    nomeUsuarioChat = "";
    carregarMensagensDoChat();
}

function fecharChat() {
    document.getElementById('modalChat').classList.add('escondido');
}

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
            idRemetente: ID_VISITANTE,
            nomeRemetente: nomeUsuarioChat,
            texto: texto,
            data: dataAtual(),
            resposta: null,
            dataResposta: null
        });
        document.getElementById('campoMensagem').value = '';
        alert("✅ Mensagem enviada!");
    } catch (e) {
        alert("❌ Erro: " + e.message);
    }
}

// ✅ SÓ MOSTRA AS MENSAGENS DESSE USUÁRIO — NÃO MOSTRA NADA DE OUTRA PESSOA
function carregarMensagensDoChat() {
    const area = document.getElementById('areaMensagens');
    
    db.ref("festival_pipas/mensagens")
      .orderByChild("idRemetente")
      .equalTo(ID_VISITANTE) // ← SÓ DELE!
      .on("value", (snap) => {
        area.innerHTML = '';
        let temMensagem = false;

        snap.forEach((item) => {
            temMensagem = true;
            const m = item.val();

            // ✅ MENSAGEM DO USUÁRIO
            area.innerHTML += `
                <div class="mensagem mensagem-me px-4 py-2 mb-1">
                    <p class="font-medium text-sm">${m.nomeRemetente}</p>
                    <p>${m.texto}</p>
                    <p class="text-xs opacity-70 mt-1">${m.data}</p>
                </div>
            `;

            // ✅ RESPOSTA DO ADMIN — SÓ SE TIVER
            if (m.resposta && !m.mensagemNovaAdmin) {
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
            area.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">Olá! Digite seu nome abaixo e depois sua mensagem!</p>';
        }

        area.scrollTop = area.scrollHeight;
    });
}

// ==========================================
// ✅ TUDO ABAIXO SÓ FUNCIONA SE FOR ADMIN
// ==========================================

function fecharModalResposta() {
    if (!acessoLiberado) return;
    document.getElementById('modalResposta').classList.add('escondido');
    document.getElementById('textoResposta').value = '';
}

async function abrirModalResponderMensagem(chave, dados) {
    if (!acessoLiberado) return;
    document.getElementById('tituloModalResposta').textContent = "🔐 Responder Mensagem";
    document.getElementById('remetenteMensagem').textContent = dados.nomeRemetente || "Sem nome";
    document.getElementById('chaveMensagemAtual').value = chave;
    document.getElementById('idDestinatario').value = dados.idRemetente;
    document.getElementById('nomeDestinatario').value = dados.nomeRemetente || "Visitante";
    document.getElementById('textoResposta').value = dados.resposta || "";
    document.getElementById('modalResposta').classList.remove('escondido');
}

async function abrirModalMensagemNova(idPessoa, nomePessoa) {
    if (!acessoLiberado) return;
    document.getElementById('tituloModalResposta').textContent = "✉️ Enviar Mensagem Nova";
    document.getElementById('remetenteMensagem').textContent = nomePessoa;
    document.getElementById('chaveMensagemAtual').value = "";
    document.getElementById('idDestinatario').value = idPessoa;
    document.getElementById('nomeDestinatario').value = nomePessoa;
    document.getElementById('textoResposta').value = "";
    document.getElementById('modalResposta').classList.remove('escondido');
}

async function enviarResposta() {
    if (!acessoLiberado) return;
    const chave = document.getElementById('chaveMensagemAtual').value;
    const idDest = document.getElementById('idDestinatario').value;
    const nomeDest = document.getElementById('nomeDestinatario').value;
    const texto = document.getElementById('textoResposta').value.trim();

    if (!texto) { alert("⚠️ Escreva sua mensagem!"); return; }
    if (!idDest) { alert("❌ Destinatário não identificado!"); return; }

    try {
        if (chave) {
            // ✅ RESPONDE MENSAGEM EXISTENTE
            await db.ref("festival_pipas/mensagens/" + chave).update({
                resposta: texto,
                dataResposta: dataAtual()
            });
            alert("✅ Resposta enviada para " + nomeDest + "!");
        } else {
            // ✅ MENSAGEM NOVA DO ADMIN — MARCA PARA NÃO APARECER COMO MENSAGEM DO USUÁRIO
            await db.ref("festival_pipas/mensagens").push({
                idRemetente: idDest,
                nomeRemetente: nomeDest,
                texto: texto,
                data: dataAtual(),
                resposta: texto,
                dataResposta: dataAtual(),
                mensagemNovaAdmin: true // ← MARCADOR ESPECIAL!
            });
            alert("✅ Mensagem enviada para " + nomeDest + "!");
        }
        fecharModalResposta();
    } catch (e) {
        alert("❌ Erro: " + e.message);
    }
}

async function excluirMensagem(chave) {
    if (!acessoLiberado) return;
    if (!confirm("⚠️ Tem certeza que deseja excluir esta mensagem?")) return;
    await db.ref("festival_pipas/mensagens/" + chave).remove();
    alert("✅ Mensagem excluída!");
}

async function limparTodasMensagens() {
    if (!acessoLiberado) return;
    if (!confirm("⚠️⚠️⚠️ TEM CERTEZA? Isso vai APAGAR TODAS as mensagens!")) return;
    await db.ref("festival_pipas/mensagens").remove();
    alert("✅ Todas as mensagens foram apagadas!");
}

function carregarTodasMensagensAdmin() {
    if (!acessoLiberado) return;

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
        let pessoasJaVistas = {};

        snap.forEach((item) => {
            temMensagem = true;
            const chave = item.key;
            const dados = item.val();
            if (dados.mensagemNovaAdmin) return; // ✅ IGNORA MENSAGENS NOVAS DO ADMIN NA LISTA DE ENTRADA

            const idPessoa = dados.idRemetente;
            const nomePessoa = dados.nomeRemetente || "Visitante";
            const status = dados.resposta 
                ? '<span class="text-green-600 text-sm font-medium">✅ Respondida</span>' 
                : '<span class="text-red-500 text-sm font-bold">⏳ Pendente</span>';

            if (idPessoa && !pessoasJaVistas[idPessoa]) {
                pessoasJaVistas[idPessoa] = true;
                lista.innerHTML += `
                    <div class="bg-purple-50 border border-purple-200 p-3 rounded-xl mb-2">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-purple-800">👤 ${nomePessoa}</span>
                            <button onclick='abrirModalMensagemNova("${idPessoa}", "${nomePessoa.replace(/"/g, '&quot;')}")' 
                                class="bg-admin text-white text-sm px-3 py-1 rounded-lg font-medium">
                                ✉️ Enviar mensagem nova
                            </button>
                        </div>
                    </div>
                `;
            }

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
                    <div class="flex gap-2">
                        <button onclick='abrirModalResponderMensagem("${chave}", ${JSON.stringify(dados).replace(/'/g, "\\'")})' 
                            class="px-4 py-2 rounded-lg text-white font-medium bg-admin">
                            ${dados.resposta ? '✏️ Editar Resposta' : '✍️ Responder'}
                        </button>
                        <button onclick="excluirMensagem('${chave}')" 
                            class="px-4 py-2 rounded-lg bg-red-500 text-white font-medium">
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
