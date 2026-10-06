const cadastro = document.getElementById('cadastro');
const nome = document.getElementById('nome');
const cpf = document.getElementById('cpf');
const dataDeNascimento = document.getElementById('data-de-nascimento');
const email = document.getElementById('email');
const senha = document.getElementById('senha');
const senha2 = document.getElementById('senha2');

const cadastroEndereco = document.getElementById('cadastro-endereco');
const cep = document.getElementById('cep');
const estado = document.getElementById('estado');
const cidade = document.getElementById('cidade');
const bairro = document.getElementById('bairro');
const rua = document.getElementById('rua');
const botaoCadastrar2 = document.getElementById('botao-cadastrar2');

const fundo2FA = document.getElementById('fundo-2fa');
const janela2FA = document.getElementById('janela-2fa');
const inputCodigo2FA = document.getElementById('codigo-2fa');
const botaoCriarCodigo = document.getElementById('botao-criar-codigo');

function teclaPermitida(tecla) {
    return ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(tecla);
}

function bloquearCamposEndereco() {
    [estado, cidade, bairro, rua].forEach(campo => {
        campo.disabled = true;
        campo.style.backgroundColor = "#f0f0f0";  
        campo.style.color = "#888"; 
        campo.style.cursor = "not-allowed";
    });
}
bloquearCamposEndereco();

cpf.addEventListener('keydown', (e) => {
    const tecla = e.key;

    if (e.ctrlKey || e.metaKey) return;

    if (teclaPermitida(tecla)) return;

    if (!/^\d$/.test(tecla)) {
        e.preventDefault();
    }
});

cpf.addEventListener('input', () => {
    let valor = cpf.value.replace(/\D/g, '')

    if (valor.length > 11) {
        valor = valor.slice(0, 11); 
    }

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpf.value = valor;
});

dataDeNascimento.addEventListener('keydown', (e) => {
    const tecla = e.key;

    if (e.ctrlKey || e.metaKey) return;

    if (teclaPermitida(tecla)) return;
    
    if (!/^\d$/.test(tecla)) {
        e.preventDefault();
    }
});

dataDeNascimento.addEventListener('input', () => {
    let valor = dataDeNascimento.value.replace(/\D/g, ''); 

    if (valor.length > 8) {
        valor = valor.slice(0, 8); 
    }
    
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/(\d{4})$/, '$1');

    dataDeNascimento.value = valor;
});

function formatarCEP(valor) {
    valor = valor.replace(/\D/g, ''); 
    if (valor.length > 8) {
        valor = valor.slice(0, 8);
    }

    if (valor.length > 5) {
        return valor.slice(0,5) + '-' + valor.slice(5);
    } else {
        return valor;
    }
}

cep.addEventListener('keydown', (e) => {
    const tecla = e.key;

    if (e.ctrlKey || e.metaKey) return;

    if (teclaPermitida(tecla)) return;

    if (!/^\d$/.test(tecla)) {
        e.preventDefault();
        return;
    }

    const numerosAtuais = cep.value.replace(/\D/g, '');
    if (numerosAtuais.length >= 8) {
        e.preventDefault();
    }
});

cep.addEventListener('paste', (e) => {
    const textoColado = e.clipboardData.getData('Text');

    if (!/^\d{1,8}$/.test(textoColado)) {
        e.preventDefault();
    }
});

cep.addEventListener('input', () => {
    cep.value = formatarCEP(cep.value);

    const numerosCEP = cep.value.replace(/\D/g, '');
    if (numerosCEP.length === 8) {
        fetch(`https://viacep.com.br/ws/${numerosCEP}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    estado.value = data.uf;
                    cidade.value = data.localidade;
                    bairro.value = data.bairro;
                    rua.value = data.logradouro;

                    [estado, cidade, bairro, rua].forEach(campo => {
                        campo.disabled = true;
                        campo.parentElement.classList.remove('desabilitado');
                    });

                    setSuccess(cep);
                } else {
                    setError(cep, 'CEP não encontrado');

                    [estado, cidade, bairro, rua].forEach(campo => {
                        campo.value = '';
                        campo.disabled = true;
                        campo.parentElement.classList.add('desabilitado');
                    });
                }
            }).catch(() => {
                setError(cep, 'Erro ao consultar CEP');
            });
    } else {
        cep.parentElement.classList.remove('sucesso');
        [estado, cidade, bairro, rua].forEach(campo => {
            campo.value = '';
            campo.disabled = true;
            campo.parentElement.classList.add('desabilitado');
        });
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.erro');

    errorDisplay.innerText = message;
    inputControl.classList.add('erro');
    inputControl.classList.remove('sucesso');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.erro');

    errorDisplay.innerText = '';
    inputControl.classList.add('sucesso');
    inputControl.classList.remove('erro');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

function isDataNascimentoValida(data) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.match(regex);

    if (!match) return {valido: false, mensagem: 'Formato inválido. Use DD/MM/AAAA'};

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const ano = parseInt(match[3], 10);

    if (mes < 1 || mes > 12) {
        return {valido: false, mensagem: 'Forneça uma data válida'};
    }

    const dataObj = new Date(ano, mes - 1, dia);
    if (
        dataObj.getFullYear() !== ano ||
        dataObj.getMonth() !== mes - 1 ||
        dataObj.getDate() !== dia
    ) {
        return {valido: false, mensagem: 'Forneça uma data válida'};
    }

    const hoje = new Date();
    const idadeMilissegundos = hoje - dataObj;
    const idade = idadeMilissegundos / (1000 * 60 * 60 * 24 * 365.25); 

    if (idade < 12) {
        return {valido: false, mensagem: 'Novo demais para criar uma conta'};
    }

    if (idade > 120) {
        return {valido: false, mensagem: 'Fóssil demais para criar uma conta'};
    }

    return {valido: true};
}

function validarNome() {
    const nomeValue = nome.value.trim();
    if (nomeValue === '') {
        setError(nome, 'O nome é obrigatório');
    } else {
        setSuccess(nome);
    }
}

function validarCPF() {
    const cpfValue = cpf.value.trim();
    if (cpfValue === '') {
        setError(cpf, 'O CPF é obrigatório');
    } else if (cpfValue.length !== 14) {
        setError(cpf, 'O CPF deve ter 11 números');
    } else {
        setSuccess(cpf);
    }
}

function validarDataNascimento() {
    const dataDeNascimentoValue = dataDeNascimento.value.trim();
    if (dataDeNascimentoValue === '') {
        setError(dataDeNascimento, 'A data de nascimento é obrigatória');
    } else {
        const resultadoData = isDataNascimentoValida(dataDeNascimentoValue);
        if (!resultadoData.valido) {
            setError(dataDeNascimento, resultadoData.mensagem);
        } else {
            setSuccess(dataDeNascimento);
        }
    }
}

function validarEmail() {
    const emailValue = email.value.trim();
    if (emailValue === '') {
        setError(email, 'O e-mail é obrigatório');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Forneça um e-mail válido');
    } else {
        setSuccess(email);
    }
}

function validarSenha() {
    const senhaValue = senha.value.trim();
    if (senhaValue === '') {
        setError(senha, 'A senha é obrigatória');
    } else if (senhaValue.length < 6) {
        setError(senha, 'A senha deve ter pelo menos 6 caracteres');
    } else {
        setSuccess(senha);
    }
}

function validarSenha2() {
    const senha2Value = senha2.value.trim();
    if (senha2Value === '') {
        setError(senha2, 'Por favor confirme sua senha');
    } else if (senha2Value !== senha.value.trim()) {
        setError(senha2, 'Senhas não coincidem');
    } else {
        setSuccess(senha2);
    }
}

nome.addEventListener('input', () => {
    if (nome.value.trim() !== '') {
        setSuccess(nome);
    }
});
nome.addEventListener('blur', validarNome);

cpf.addEventListener('input', () => {
    if (cpf.value.trim().length === 14) {
        setSuccess(cpf);
    }
});
cpf.addEventListener('blur', validarCPF);

dataDeNascimento.addEventListener('input', () => {
    if (isDataNascimentoValida(dataDeNascimento.value.trim()).valido) {
        setSuccess(dataDeNascimento);
    }
});
dataDeNascimento.addEventListener('blur', validarDataNascimento);

email.addEventListener('input', () => {
    if (isValidEmail(email.value.trim())) {
        setSuccess(email);
    }
});
email.addEventListener('blur', validarEmail);

senha.addEventListener('input', () => {
    if (senha.value.trim().length >= 6) {
        setSuccess(senha);
    }
});
senha.addEventListener('blur', validarSenha);

senha2.addEventListener('input', () => {
    if (senha2.value.trim() === senha.value.trim() && senha2.value.trim() !== '') {
        setSuccess(senha2);
    }
});
senha2.addEventListener('blur', validarSenha2);

document.getElementById('botao-cadastrar').addEventListener('click', () => {
    validarNome();
    validarCPF();
    validarDataNascimento();
    validarEmail();
    validarSenha();
    validarSenha2();

    const campos = [nome, cpf, dataDeNascimento, email, senha, senha2];
    const todosValidos = campos.every(campo => campo.parentElement.classList.contains('sucesso'));

    if (todosValidos) {
        const form1 = document.getElementById('cadastro');
        const form2 = document.getElementById('cadastro-endereco');

        form1.classList.add('esconder');
        form1.addEventListener('transitionend', () => {
            form1.style.display = 'none';
            form2.classList.add('mostrar');
        }, {once: true});
    }
});

const validateEndereco = () => {
    const cepValue = cep.value.trim();
    const estadoValue = estado.value.trim();
    const cidadeValue = cidade.value.trim();
    const bairroValue = bairro.value.trim();
    const ruaValue = rua.value.trim();

    let valid = true;

    if (cepValue === '') {
        setError(cep, 'O CEP é obrigatório');
        valid = false;
    } else {
        setSuccess(cep);
    }

    if (estadoValue === '') {
        setError(estado, 'O estado é obrigatório');
        valid = false;
    } else {
        setSuccess(estado);
    }

    if (cidadeValue === '') {
        setError(cidade, 'A cidade é obrigatória');
        valid = false;
    } else {
        setSuccess(cidade);
    }

    if (bairroValue === '') {
        setError(bairro, 'O bairro é obrigatório');
        valid = false;
    } else {
        setSuccess(bairro);
    }

    if (ruaValue === '') {
        setError(rua, 'A rua é obrigatória');
        valid = false;
    } else {
        setSuccess(rua);
    }

    return valid;
};

inputCodigo2FA.addEventListener('input', () => {
    inputCodigo2FA.value = inputCodigo2FA.value.replace(/\D/g, '').slice(0, 6);
});

function mostrarJanela2FA() {
    fundo2FA.style.display = 'block';
    janela2FA.style.display = 'block';

    requestAnimationFrame(() => {
        fundo2FA.classList.add('mostrar');
        janela2FA.classList.add('mostrar');
    });
}

function validarCodigo2FA(codigo) {
    if (codigo === '') {
        setError(inputCodigo2FA, 'Digite um código');
        return false;
    }
    if (!/^\d{6}$/.test(codigo)) {
        setError(inputCodigo2FA, 'O código deve conter exatamente 6 dígitos numéricos');
        return false;
    }
    setSuccess(inputCodigo2FA);
    return true;
}

function salvarUsuarioCom2FA(codigo2FA) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const novoUsuario = {
        nome: nome.value.trim(),
        cpf: cpf.value.trim(),
        data_de_nascimento: dataDeNascimento.value.trim(),
        email: email.value.trim(),
        senha: senha.value.trim(),
        cep: cep.value.trim(),
        estado: estado.value.trim(),
        cidade: cidade.value.trim(),
        bairro: bairro.value.trim(),
        rua: rua.value.trim(),
        codigo2FA: codigo2FA
    };
    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

botaoCadastrar2.addEventListener('click', () => {
    const enderecoValido = validateEndereco();

    if (enderecoValido) {
        mostrarJanela2FA();
    }
});

botaoCriarCodigo.addEventListener('click', () => {
    const valorCodigo = inputCodigo2FA.value.trim();

    if (validarCodigo2FA(valorCodigo)) {
        salvarUsuarioCom2FA(valorCodigo);
        janela2FA.classList.remove('mostrar');
        window.location.href = "login.html";
    }
});
