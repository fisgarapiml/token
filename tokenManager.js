const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const TOKEN_FILE = path.join(__dirname, 'token.json');

// Middleware para analisar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para obter e salvar o token
async function getAccessToken() {
    const app_id = "4671827004138793";
    const client_secret = "PItMfuS5eshnlbdCYxsRb8oXdtffffri";
    const refresh_token = "TG-670f03e82ae16f0001409cd4-555536943";
    const url_principal = "https://api.mercadolibre.com/oauth/token";

    const headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };
    
    const dados = `grant_type=refresh_token&client_id=${app_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`;

    const resposta = await fetch(url_principal, {
        method: 'POST',
        headers: headers,
        body: dados
    });

    const resposta_json = await resposta.json();
    
    // Salvar o token no arquivo
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(resposta_json));
    return resposta_json.access_token;
}

// Rota para obter o token
app.get('/getAccessToken', async (req, res) => {
    try {
        const token = await getAccessToken();
        res.json({ access_token: token });
    } catch (error) {
        console.error("Erro ao obter o token:", error);
        res.status(500).send("Erro ao obter o token");
    }
});

// Rota para buscar as vendas
app.get('/orders', async (req, res) => {
    console.log("Rota /orders acessada"); // Para depuração
    try {
        const token = JSON.parse(fs.readFileSync(TOKEN_FILE)).access_token;

        // Chamada à API para obter os pedidos
        const url_orders = `https://api.mercadolibre.com/orders/search?seller=555536943&access_token=${token}`;
        const response = await fetch(url_orders);

        if (!response.ok) {
            // Se a resposta não for OK, lance um erro
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error); // Log para ajudar na depuração
        res.status(500).send("Erro ao buscar pedidos");
    }
});

// Porta onde o servidor será executado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT} - http://localhost:${PORT}`);
});

