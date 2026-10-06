const login = document.getElementById('login')
const email = document.getElementById('email')
const senha = document.getElementById('senha')

const janela2FA = document.getElementById('janela-2fa');
const fundo2FA = document.getElementById('fundo-2fa');
const inputCodigo2FA = document.getElementById('codigo-2fa');
const botaoEntrar2 = document.getElementById('botao-entrar2');

login.addEventListener('submit', e => {
    e.preventDefault()
    validadeLoginInputs()
})

const setError = (element, message) => {
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.erro')

    errorDisplay.innerText = message
    inputControl.classList.add('erro')
    inputControl.classList.remove('sucesso')
}

const setSuccess = element => {
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.erro')

    errorDisplay.innerText = ''
    inputControl.classList.add('sucesso')
    inputControl.classList.remove('erro')
}

const validadeLoginInputs = () => {
    const emailValue = email.value.trim()
    const senhaValue = senha.value.trim()

    let valid = true

    if (emailValue === '') {
        setError(email, 'O e-mail é obrigatório')
        valid = false
    } else {
        setSuccess(email)
    }

    if (senhaValue === '') {
        setError(senha, 'A senha é obrigatória')
        valid = false
    } else {
        setSuccess(senha)
    }

    if (valid) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

        const usuarioValido = usuarios.find(usuario =>
            usuario.email === emailValue && usuario.senha === senhaValue
        )

        if (usuarioValido) {
            localStorage.setItem("usuarioTemp", JSON.stringify(usuarioValido));
            mostrarJanela2FA();
        } else {
            setError(email, 'E-mail ou senha incorretos')
            setError(senha, '')
        }
    }
}

function mostrarJanela2FA() {
    fundo2FA.style.display = 'block';
    janela2FA.style.display = 'block';

    requestAnimationFrame(() => {
        fundo2FA.classList.add('mostrar');
        janela2FA.classList.add('mostrar');
    });
}

inputCodigo2FA.addEventListener('input', () => {
    inputCodigo2FA.value = inputCodigo2FA.value.replace(/\D/g, '').slice(0, 6);
});

botaoEntrar2.addEventListener('click', () => {
    const valorCodigo = inputCodigo2FA.value.trim();
    const usuario = JSON.parse(localStorage.getItem("usuarioTemp"));

    if (!usuario) return;

    const codigoCorreto = usuario.codigo2FA;

    if (valorCodigo === '') {
        setError(inputCodigo2FA, 'Digite o código');
    } else if (valorCodigo !== codigoCorreto) {
        setError(inputCodigo2FA, 'Código incorreto');
    } else {
        setSuccess(inputCodigo2FA);
        localStorage.removeItem("usuarioTemp");
        localStorage.setItem("logado", "true");
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        window.location.href = "index.html";
    }
});