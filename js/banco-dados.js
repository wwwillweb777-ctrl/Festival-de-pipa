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
            
            // ✅ MOSTRA O NOME + O QUE FOI OFERECIDO
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
