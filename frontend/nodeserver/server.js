const express = require('express');
const path = require('path');
const app = express();

// Defina o diretório de arquivos estáticos
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Inicie o servidor na porta 3000 (ou qualquer outra porta que preferir)
const port = 80;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
