const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const cron = require('node-cron');

// Middleware para analisar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Variável global para armazenar o access_token
let accessToken = null;

// Rota para a raiz
app.get('/', (req, res) => {
    res.send('API funcionando! Acesse /testConnection para testar a conexão.');
});

// Rota de teste simples
app.get('/testConnection', (req, res) => {
    res.send('Conexão bem-sucedida!');
});

// Rota para obter um novo access token
app.post('/getAccessToken', async (req, res) => {
    const app_id = "4671827004138793";
    const client_secret = "PItMfuS5eshnlbdCYxsRb8oXdtffffri";
    const code = "TG-670d8a93ac9f0c000199642d-555536943";
    const redirect_uri = "https://www.fisgartoys.com.br";

    const url_principal = "https://api.mercadolibre.com/oauth/token";
    const headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };

    const dados = `grant_type=authorization_code&client_id=${app_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`;

    try {
        const resposta = await fetch(url_principal, {
            method: 'POST',
            headers: headers,
            body: dados
        });

        const resposta_json = await resposta.json();
        console.log(resposta_json);
        res.json(resposta_json); // Retorne a resposta JSON
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send("Erro ao processar a requisição");
    }
});

// Nova Rota para Atualizar o Access Token
app.post('/refreshAccessToken', async (req, res) => {
    const app_id = "4671827004138793";
    const client_secret = "PItMfuS5eshnlbdCYxsRb8oXdtffffri";
    const refresh_token = "TG-6726581c038b8e00014a797b-555536943"; // Atualize conforme necessário
    const url_principal = "https://api.mercadolibre.com/oauth/token";

    const headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };

    const dados = `grant_type=refresh_token&client_id=${app_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`;

    try {
        const resposta = await fetch(url_principal, {
            method: 'POST',
            headers: headers,
            body: dados
        });

        const resposta_json = await resposta.json();
        accessToken = resposta_json.access_token; // Armazenar o novo access_token
        console.log('Novo access_token:', accessToken);
        res.json(resposta_json); // Retorne a resposta JSON
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send("Erro ao processar a requisição");
    }
});

// Agendar a troca do access_token a cada 6 horas
cron.schedule('0 */6 * * *', async () => {
    console.log('Tentando atualizar o access_token...');
    try {
        const resposta = await fetch('https://token-blond-mu.vercel.app/refreshAccessToken', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resposta_json = await resposta.json();
        accessToken = resposta_json.access_token; // Atualizar a variável global
        console.log('Novo access_token:', accessToken);
    } catch (error) {
        console.error('Erro ao atualizar o access_token:', error);
    }
});

// Rota para obter o access_token atual
app.get('/currentAccessToken', (req, res) => {
    if (accessToken) {
        res.json({ access_token: accessToken });
    } else {
        res.status(404).send("Token não encontrado");
    }
});

// Porta onde o servidor será executado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT} - http://localhost:${PORT}`);
});












