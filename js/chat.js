function carregarTodasMensagensAdmin() {
    // ✅ SÓ CRIA O PAINEL SE FOR ADMINISTRADOR
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
