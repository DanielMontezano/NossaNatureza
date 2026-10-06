document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('info-usuario');
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        lista.innerHTML = "<li>Usuário não está logado.</li>";
        return;
    }

    const {nome, email, cpf, data_de_nascimento, estado, cidade, bairro, rua} = usuario;
    const endereco = `${estado} / ${cidade} / ${bairro} / ${rua}`;

    lista.innerHTML = `
        <li><strong>Nome completo:</strong> ${nome}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>CPF:</strong> ${cpf}</li>
        <li><strong>Data de Nascimento:</strong> ${data_de_nascimento}</li>
        <li><strong>Endereço:</strong> ${endereco}</li>
    `;
});