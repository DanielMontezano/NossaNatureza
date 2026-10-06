// dark mode //
const botao = document.getElementById("modoToggle");
botao.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    botao.textContent = document.body.classList.contains("dark-mode") ? "Modo Claro" : "Modo Escuro";
});

// aumentar fonte //
const botaoFonte = document.getElementById("aumentarFonte");
botaoFonte.addEventListener("click", () => {
    document.body.classList.toggle("aumentar-fonte");
    botaoFonte.textContent = document.body.classList.contains("aumentar-fonte") ? "A-" : "A+";
});