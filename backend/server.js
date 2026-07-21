// server.js — Ponto de entrada do back-end (TaskFlow API)

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const autenticar   = require('./middleware/auth');
const apenasAdmin  = require('./middleware/admin');
const authRoutes   = require('./routes/auth');
const tarefasRoutes = require('./routes/tarefas');
const adminRoutes  = require('./routes/admin');

const app  = express();
// O Render define a porta automaticamente via process.env.PORT
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────
// CORS — permite que o front-end na Vercel acesse esta API
// ─────────────────────────────────────────
// Coloque aqui a URL do seu front na Vercel (variável de ambiente FRONTEND_URL).
// Enquanto testa, deixamos liberado para qualquer origem.
const origensPermitidas = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5500', 'http://127.0.0.1:5500']
  : true; // true = libera todas as origens (útil durante os testes)

app.use(cors({
  origin: origensPermitidas,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─────────────────────────────────────────
// Rotas
// ─────────────────────────────────────────
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', mensagem: 'TaskFlow API funcionando! 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tarefas', autenticar, tarefasRoutes);
app.use('/api/admin', autenticar, apenasAdmin, adminRoutes);

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
});
