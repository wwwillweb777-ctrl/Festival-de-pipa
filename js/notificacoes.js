let notifConfig = JSON.parse(localStorage.getItem("notifConfig")) || {
    mensagem: true, resposta: true, participante: true, apoiador: true, atualizacao: true
};
let listaNotificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];

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
function adicionarNotificacao(tipo, titulo, mensagem) {
    if (!notifConfig[tipo]) return;
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
    mostrarNotifTela(notif);
    atualizarContadorNotif();
}
function mostrarNotifTela(notif) {
    const caixa = document.getElementById('caixaNotificacoes');
    if (!caixa) return;
    const cor = {
        mensagem: 'border-l-primario',
        resposta: 'border-l-green-500',
        participante: 'border-l-participante',
        apoiador: 'border-l-patrocinador',
        atualizacao: 'border-l-gray-500'
    }[notif.tipo] || 'border-l-gray-400';
    const div = document.createElement('div');
    div.className = `item-notif bg-white shadow-lg rounded-lg p-3 border-l-4 ${cor} max-w-xs`;
    div.innerHTML = `
        <p class="font-bold text-sm">${notif.titulo}</p>
        <p class="text-xs text-gray-600 mt-1">${notif.mensagem}</p>
        <p class="text-xs text-gray-400 mt-1">${notif.data}</p>
    `;
    caixa.appendChild(div);
    setTimeout(() => { if (div.parentNode) div.remove(); }, 6000);
}
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
function abrirNotificacoes() {
    const modal = document.getElementById('modalNotificacoes');
    if (modal) {
        modal.classList.remove('escondido');
        renderizarListaNotificacoes();
    }
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
        const cor = notif.lida ? 'bg-gray-50' : 'bg-sky-50';
        lista.innerHTML += `
            <div class="p-3 rounded-lg border ${cor} ${notif.lida ? 'opacity-60' : ''}">
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
