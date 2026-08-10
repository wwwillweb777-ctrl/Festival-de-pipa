const firebaseConfig = {
    apiKey: "AIzaSyATcfKpiac2DKdSjafq-NwAnuMBnxD9VBE",
    authDomain: "truco-mineiro-1df23.firebaseapp.com",
    databaseURL: "https://truco-mineiro-1df23-default-rtdb.firebaseio.com",
    projectId: "truco-mineiro-1df23",
    storageBucket: "truco-mineiro-1df23.firebasestorage.app",
    messagingSenderId: "597079073519",
    appId: "1:597079073519:web:b1c8d7e6f5a4b3c9d2e1f3"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
function dataAtual() {
    return new Date().toLocaleString('pt-BR');
}
const SENHA_ADMIN = "WJ321";
const NOME_REMETENTE_ADMIN = "Programador";
let acessoLiberado = false;
const ID_VISITANTE = localStorage.getItem("idVisitante") || ("usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9));
localStorage.setItem("idVisitante", ID_VISITANTE);
