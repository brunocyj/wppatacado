const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code gerado! Escaneie-o com seu WhatsApp');
});

client.on('ready', () => {
    console.log('Cliente WhatsApp está pronto!');
});

const NUMERO_DESTINO = '5511983422642@c.us';

app.post('/enviar-mensagem', async (req, res) => {
    try {
        const { mensagem } = req.body;

        await client.sendMessage(NUMERO_DESTINO, mensagem);
        
        res.status(200).json({
            status: 'success',
            message: 'Mensagem enviada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

client.initialize(); 