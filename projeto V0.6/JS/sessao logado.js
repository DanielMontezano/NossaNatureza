document.addEventListener("DOMContentLoaded", () => {
  const logado = localStorage.getItem("logado") === "true";
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (logado && usuario) {
    const logarBtn = document.querySelector(".logar-btn");
    if (!logarBtn) return;

    const menuHTML = `
      <a href="#" onclick="return false">
        <i class="fa-solid fa-user"></i> ${usuario.nome.trim().split(" ")[0]} <span class="arrow">▼</span>
      </a>
      <div class="dropdown-menu">
        <a href="perfil.html">Perfil</a>
        <a href="afiliado.html">Área de Afiliado</a>
        <a href="#" onclick="logout()" style="color: red;">Desconectar</a>
      </div>
    `;
    logarBtn.innerHTML = menuHTML;
  }
});

function logout() {
  localStorage.removeItem("logado");
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}
