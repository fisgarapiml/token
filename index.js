
// index.js

const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');

// Middleware para analisar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Rota de teste simples
app.get('/testConnection', (req, res) => {
    res.send('Conexão bem-sucedida!');
});

// Rota /test
app.post('/test', async (req, res) => {
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

    const resposta = await fetch(url_principal, {
        method: 'POST',
        headers: headers,
        body: dados
    });

    const resposta_json = await resposta.json();
    console.log(resposta_json);
    res.send("OK"); 
}); 

// Rota /getAcessToken
app.post('/getAcessToken', async (req, res) => {
    const app_id = "4671827004138793";
    const client_secret = "PItMfuS5eshnlbdCYxsRb8oXdtffffri";
    const refresh_token = "TG-670d65b2ae615600017be48f-555536943";
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
    console.log(resposta_json);
    res.send("OK");
});

// Porta onde o servidor será executado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT} - http://localhost:${PORT}`);
});


