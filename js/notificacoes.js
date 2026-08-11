let listaNotificacoes = [];

// ✅ VERIFICA SE É ADMINISTRADOR
function souAdministrador() {
    const acesso = localStorage.getItem("acessoAdministrativo");
    return acesso === "liberado";
}

// ✅ CARREGA NOTIFICAÇÕES DO BANCO — SÓ PARA VOCÊ!
function carregarNotificacoesDoBanco() {
    if (!souAdministrador()) return;
    
    db.ref("festival_pipas/notificacoes")
        .orderByChild("data")
        .limitToLast(30)
        .on("value", (snap) => {
            listaNotificacoes = [];
            snap.forEach((item) => {
                const n = item.val();
                listaNotificacoes.unshift(n);
            });
            renderizarListaNotificacoes();
            atualizarContadorNotif();
        });
}

function atualizarContadorNotif() {
    const naoLidas = listaNotificacoes.filter(n => !n.lida).length;
    const contador = document.getElementById('contadorNotif');
    if (contador) {
        naoLidas > 0 ? (contador.classList.remove('escondido'), contador.textContent = naoLidas > 9 ? '9+' : naoLidas) : contador.classList.add('escondido');
    }
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
            </div>
        `;
    });
}

function marcarLida(indice) {
    listaNotificacoes[indice].lida = true;
    renderizarListaNotificacoes();
    atualizarContadorNotif();
}

function apagarTodasNotificacoes() {
    if (confirm('Tem certeza que deseja apagar TODAS as notificações?')) {
        db.ref("festival_pipas/notificacoes").remove();
        listaNotificacoes = [];
        renderizarListaNotificacoes();
        atualizarContadorNotif();
    }
}

// ✅ QUANDO A PÁGINA CARREGAR → BUSCA AS NOTIFICAÇÕES
document.addEventListener('DOMContentLoaded', function() {
    if (souAdministrador()) {
        carregarNotificacoesDoBanco();
    }
});
