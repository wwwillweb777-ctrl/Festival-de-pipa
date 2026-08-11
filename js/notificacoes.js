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
