const SENHA_ADMIN = "WJ321";
const NOME_REMETENTE_ADMIN = "Programador";
let acessoLiberado = false;
let nomeUsuarioChat = "";

const ID_VISITANTE = localStorage.getItem("idVisitante") || ("usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9));
localStorage.setItem("idVisitante", ID_VISITANTE);

const firebaseConfig = {
    apiKey: "AIzaSyCqsOq01FhDq9z9Wn0tK9XbP8mIeQ9z7yM",
    authDomain: "willobras.firebaseapp.com",
    databaseURL: "https://willobras-default-rtdb.firebaseio.com",
    projectId: "willobras",
    storageBucket: "willobras.firebasestorage.app",
    messagingSenderId: "66370500400",
    appId: "1:66370500400:web:42d6569ca2c8172ddf3af5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function dataAtual() {
    return new Date().toLocaleString('pt-BR');
}
