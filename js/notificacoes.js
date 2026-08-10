let notifConfig = JSON.parse(localStorage.getItem("notifConfig")) || {
    mensagem: true, resposta: true, participante: true, apoiador: true, atualizacao: true
};
let listaNotificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];

// ==========================================
// ✅ FUNÇÃO PRINCIPAL — ADICIONAR NOTIFICAÇÃO
// ==========================================
function adicionarNotificacao(tipo, titulo, mensagem) {
    console.log("🔔 Nova notificação:", tipo, titulo, mensagem);

    // Se usuário desligou esse tipo, não mostra
    if (!notifConfig[tipo]) return;

    // Monta o objeto da notificação
    const notif = {
        id: Date.now(),
        tipo: tipo,
        titulo: titulo,
        mensagem: mensagem,
        lida: false,
        data: new Date().toLocaleString('pt-BR')
    };

    // Adiciona na lista e salva
    listaNotificacoes.unshift(notif);
    if (listaNotificacoes.length > 30) listaNotificacoes.pop();
    localStorage.setItem("notificacoes", JSON.stringify(listaNotificacoes));

    // ✅ MOSTRA NA TELA DO SITE AGORA MESMO!
    mostrarNotifNaTela(notif);

    // ✅ ATUALIZA O CONTADOR DO SININHO
    atualizarContadorNotif();
}

// ==========================================
// ✅ MOSTRA A NOTIFICAÇÃO CAINDO NA TELA
// ==========================================
function mostrarNotifNaTela(notif) {
    const caixa = document.getElementById('caixaNotificacoes');
    if (!caixa) {
        console.log("❌ Caixa de notificações NÃO ENCONTRADA!");
        return;
    }

    // Cor de acordo com o tipo
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
    `;
    div.innerHTML = `
        <p style="font-weight:bold; margin:0 0 4px 0;">${notif.titulo}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px 0;">${notif.mensagem}</p>
        <p style="font-size:11px; color:#999; margin:0;">${notif.data}</p>
    `;

    caixa.appendChild(div);

    // Some depois de 8 segundos
    setTimeout(() => {
        if (div.parentNode) div.remove();
    }, 8000);
}

// ==========================================
// ✅ CONTADOR DO SININHO
// ==========================================
function atualizarContadorNotif() {
    const naoLidas = listaNotificacoes.filter(n => !n.lida).length;
    const contador = document.getElementById('contadorNotif');
    if (contador) {
        if (naoLidas > 0) {
            contador.classList.remove('escondido');
            contador.textContent = naoLidas > 9 ? '9+' : naoLidas;
        } else {
            contador.classList.add('escondido');
        }
    }
}

// ==========================================
// ✅ OUTRAS FUNÇÕES
// ==========================================
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
    if (modal) modal.classList.remove('escondido');
    renderizarListaNotificacoes();
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
            <div class="p-3 rounded-lg border ${corFundo} ${notif.lida ? 'opacity-60' : ''}">
                <p class="font-bold text-sm">${notif.titulo}</p>
                <p class="text-sm text-gray-700">${notif.mensagem}</p>
                <p class="text-xs text-gray-400 mt-1">${notif.data}</p>
                ${!notif.lida ? `<button onclick="marcarLida(${indice})" class="text-xs text-primario mt-1">✓ Marcar lida</button>` : ''}
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
    if (modal) {
        modal.classList.remove('escondido');
        atualizarBotoesNotif();
    }
}

function fecharConfiguracoesNotif() {
    const modal = document.getElementById('modalConfiguracoesNotif');
    if (modal) modal.classList.add('escondido');
}

// ==========================================
// ✅ TESTE AUTOMÁTICO — VAI APARECER AGORA!
// ==========================================
setTimeout(() => {
    adicionarNotificacao('atualizacao', '🔔 Sistema Atualizado!', 'As notificações já estão funcionando!');
}, 1500);
