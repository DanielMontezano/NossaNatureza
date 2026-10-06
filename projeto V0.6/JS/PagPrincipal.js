function estaLogado() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    return usuarioLogado !== null;
}

document.addEventListener("DOMContentLoaded", () => {
    const botaoDoacao = document.querySelector(".botao-destaque");

    if (botaoDoacao) {
        botaoDoacao.addEventListener("click", (e) => {
            e.preventDefault();

            if (estaLogado()) {
                window.location.href = "doacao.html";
            } else {
                window.location.href = "login.html";
            }
        });
    }
});