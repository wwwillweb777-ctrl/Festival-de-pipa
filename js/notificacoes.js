let notifConfig = JSON.parse(localStorage.getItem("notifConfig")) || {
    mensagem: true,
    resposta: true,
    participante: true,
    apoiador: true,
    atualizacao: true
};
let listaNotificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];

// ✅ VERIFICA SE É ADMINISTRADOR
function souAdministrador() {
    const acesso = localStorage.getItem("acessoAdministrativo");
    console.log("🔍 Verificando se é admin:", acesso);
    return acesso === "liberado";
}

// ✅ FUNÇÃO PRINCIPAL — ADMIN RECEBE TUDO SEM EXCEÇÃO!
function adicionarNotificacao(tipo, titulo, mensagem) {
    console.log("🔔 NOVA NOTIFICAÇÃO — Tipo:", tipo, "| Título:", titulo, "| Mensagem:", mensagem);
    console.log("👑 É ADMINISTRADOR?", souAdministrador());

    // ✅ SE FOR ADMIN → RECEBE TUDO, SEM OLHAR CONFIGURAÇÃO!
    if (!souAdministrador()) {
        // Usuário comum → segue a configuração
        if (!notifConfig[tipo]) {
            console.log("⚠️ Usuário comum — tipo desativado:", tipo);
            return;
        }
    }

    // ✅ MONTA A NOTIFICAÇÃO
    const notif = {
        id: Date.now(),
        tipo: tipo,
        titulo: titulo,
        mensagem: mensagem,
        lida: false,
        data: new Date().toLocaleString('pt-BR')
    };

    listaNotificacoes.unshift(notif);
    if (listaNotificacoes.length > 30) listaNotificacoes.pop();
    localStorage.setItem("notificacoes", JSON.stringify(listaNotificacoes));

    console.log("✅ Notificação salva! Total:", listaNotificacoes.length);
    
    mostrarNotifNaTela(notif);
    atualizarContadorNotif();
}

// ✅ NOTIFICAÇÃO FLUTUANTE
function mostrarNotifNaTela(notif) {
    const caixa = document.getElementById('caixaNotificacoes');
    if (!caixa) {
        console.log("⚠️ Caixa não encontrada!");
        return;
    }

    const cor = {
        mensagem: '#0284c7',
        resposta: '#10B981',
        participante: '#10B981',
        apoiador: '#F59E0B',
        atualizacao: '#6B7280'
    }[notif.tipo] || '#888888';

    const div = document.createElement('div');
    div.style.cssText = `
        background: white;
        border-left: 4px solid ${cor};
        padding: 12px;
        margin: 8px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: desce 0.3s ease-out;
        max-width: 300px;
        position: relative;
        z-index: 10;
    `;
    div.innerHTML = `
        <p style="font-weight:bold; margin:0 0 4px 0;">${notif.titulo}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px 0;">${notif.mensagem}</p>
        <p style="font-size:11px; color:#999; margin:0;">${notif.data}</p>
    `;
    caixa.appendChild(div);
    setTimeout(() => { if (div.parentNode) div.remove(); }, 8000);
}

function apagarNotificacao(indice) {
    listaNotificacoes.splice(indice, 1);
    localStorage.setItem("notificacoes", JSON.stringify(listaNotificacoes));
    renderizarListaNotificacoes();
    atualizarContadorNotif();
}

function apagarTodasNotificacoes() {
    if (confirm('Tem certeza que deseja apagar TODAS as notificações?')) {
        listaNotificacoes = [];
        localStorage.setItem("notificacoes", JSON.stringify(listaNotificacoes));
        renderizarListaNotificacoes();
        atualizarContadorNotif();
    }
}

function atualizarContadorNotif() {
    const naoLidas = listaNotificacoes.filter(n => !n.lida).length;
    const contador = document.getElementById('contadorNotif');
    if (contador) {
        naoLidas > 0 ? (contador.classList.remove('escondido'), contador.textContent = naoLidas > 9 ? '9+' : naoLidas) : contador.classList.add('escondido');
    }
}

function alternarNotif(tipo) {
    notifConfig[tipo] = !notifConfig[tipo];
    localStorage.setItem("notifConfig", JSON.stringify(notifConfig));
    atualizarBotoesNotif();
}

function atualizarBotoesNotif() {
    Object.keys(notifConfig).forEach(tipo => {
        const btn = document.getElementById("notif" + tipo.charAt(0).toUpperCase() + tipo.slice(1));
        if (btn) {
            btn.textContent = notifConfig[tipo] ? "SIM" : "NÃO";
            btn.classList.toggle("toggle-ativo", notifConfig[tipo]);
            btn.classList.toggle("toggle-desativado", !notifConfig[tipo]);
        }
    });
}

function abrirNotificacoes() {
    const modal = document.getElementById('modalNotificacoes');
    if (modal) { modal.classList.remove('escondido'); renderizarListaNotificacoes(); }
}

function fecharNotificacoes() {
    const modal = document.getElementById('modalNotificacoes');
    if (modal) modal.classList.add('escondido');
}

function renderizarListaNotificacoes() {
    const lista = document.getElementById('listaNotificacoes');
    if (!lista) return;
    if (listaNotificacoes.length === 0) {
        lista.innerHTML = '<p class="text-gray-400 text-center py-8">Nenhuma notificação ainda 🔔</p>';
        return;
    }
    lista.innerHTML = '';
    listaNotificacoes.forEach((notif, indice) => {
        const corFundo = notif.lida ? 'bg-gray-50' : 'bg-sky-50';
        lista.innerHTML += `
            <div class="p-3 rounded-lg border ${corFundo} ${notif.lida ? 'opacity-60' : ''} flex justify-between items-start gap-2">
                <div class="flex-1">
                    <p class="font-bold text-sm">${notif.titulo}</p>
                    <p class="text-sm text-gray-700">${notif.mensagem}</p>
                    <p class="text-xs text-gray-400 mt-1">${notif.data}</p>
                    ${!notif.lida ? `<button onclick="marcarLida(${indice})" class="text-xs text-primario mt-1">✓ Marcar lida</button>` : ''}
                </div>
                <button onclick="apagarNotificacao(${indice})" class="text-red-500 hover:text-red-700 text-lg font-bold px-1" title="Apagar">🗑️</button>
            </div>
        `;
    });
}

function marcarLida(indice) {
    listaNotificacoes[indice].lida = true;
    localStorage.setItem("notificacoes", JSON.stringify(listaNotificacoes));
    renderizarListaNotificacoes();
    atualizarContadorNotif();
}

function marcarTodasLidas() {
    listaNotificacoes.forEach(n => n.lida = true);
    localStorage.setItem("notificacoes", JSON.stringify(listaNotificacoes));
    renderizarListaNotificacoes();
    atualizarContadorNotif();
}

function abrirConfiguracoesNotif() {
    const modal = document.getElementById('modalConfiguracoesNotif');
    if (modal) { modal.classList.remove('escondido'); atualizarBotoesNotif(); }
}

function fecharConfiguracoesNotif() {
    const modal = document.getElementById('modalConfiguracoesNotif');
    if (modal) modal.classList.add('escondido');
}
