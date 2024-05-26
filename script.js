document.addEventListener("DOMContentLoaded", function() {
    const botaoConsulta = document.getElementById("botaoConsultar");
    const botaoSave = document.getElementById("botaoSalvar");
    const resultCep = document.getElementById("resultadoCep");
    const enderecosSaves = document.getElementById("enderecosSalvos");

    carregarEnderecos();


    botaoConsulta.addEventListener("click", function() {
        const cep = document.getElementById("cep").value;
        if (cep.match(/^\d{5}-?\d{3}$/)) {
            consultarCEP(cep);
        } else {
            resultCep.innerHTML = "Por favor, insira um CEP válido no formato 00000-000.";
        }
    });

    botaoSave.addEventListener("click", function() {
        if (Object.keys(enderecoAtual).length > 0) {
            salvarEndereco(enderecoAtual);
        }
    });

    function consultarCEP(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    enderecoAtual = data;
                    resultCep.innerHTML = `
                        <p> <b>CEP:</b> ${data.cep}</p> <br>
                        <p> <b>Logradouro:</b> ${data.logradouro}</p> <br>
                        <p> <b>Bairro:</b> ${data.bairro}</p> <br>
                        <p> <b>Cidade:</b> ${data.localidade}</p> <br>
                        <p> <b>Estado:</b> ${data.uf}</p>
                    `;
                } else {
                    resultCep.innerHTML = "CEP não encontrado.";
                    enderecoAtual = {};
                }
            })
            .catch(error => {
                console.error("Erro ao consultar o CEP:", error);
                resultCep.innerHTML = "Erro ao consultar o CEP. Tente novamente mais tarde.";
                enderecoAtual = {};
            });
    }

    function salvarEndereco(endereco) {
        let enderecos = JSON.parse(localStorage.getItem("enderecosSalvos")) || [];
        enderecos.push(endereco);
        localStorage.setItem("enderecosSalvos", JSON.stringify(enderecos));
        adcEnderecoDOM(endereco);
    }

    function carregarEnderecos() {
        let enderecos = JSON.parse(localStorage.getItem("enderecosSalvos")) || [];
        enderecos.forEach(endereco => {
            adcEnderecoDOM(endereco);
        });
    }

    function adcEnderecoDOM(endereco) {
        const p = document.createElement("p");
        p.innerHTML = `
            <p> <b>CEP:</b> ${endereco.cep}</p> <br>
            <p> <b>Logradouro:</b> ${endereco.logradouro}</p> <br>
            <p> <b>Bairro:</b> ${endereco.bairro}</p> <br>
            <p> <b>Cidade:</b> ${endereco.localidade}</p> <br>
            <p> <b>Estado:</b> ${endereco.uf}</p>
            <p> <b>--------------------------------------------------------</b> </p>
        `;
        enderecosSaves.appendChild(p);
    }
});

