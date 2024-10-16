const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');

// Middleware para analisar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota /getinfovenda
app.get('/getinfovenda', async (req, res) => {
    res.send("API está funcionando!");
});

// Porta onde o servidor será executado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT} - http://localhost:${PORT}`);
});



https://api.mercadolibre.com/orders/search?seller=555536943&order.date_created.from=2024-01-01T00:00:00.000-00:00&order.date_created.to=2024-12-31T23:59:59.999-00:00&access_token=APP_USR-4671827004138793-101520-fde6dcc304cb82caf0ad1fc56b64ff77-555536943