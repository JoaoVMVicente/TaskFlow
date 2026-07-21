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
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────
// Middlewares globais
// ─────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
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

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas de tarefas — protegidas por JWT
app.use('/api/tarefas', autenticar, tarefasRoutes);

// Rotas de admin — protegidas por JWT + role admin
// autenticar verifica o token, apenasAdmin verifica o role
app.use('/api/admin', autenticar, apenasAdmin, adminRoutes);

// ─────────────────────────────────────────
// Inicia o servidor
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📋 Endpoints disponíveis:');
  console.log('   GET    /api/ping');
  console.log('   POST   /api/auth/registro');
  console.log('   POST   /api/auth/login');
  console.log('   GET    /api/tarefas          (protegido)');
  console.log('   POST   /api/tarefas          (protegido)');
  console.log('   PUT    /api/tarefas/:id      (protegido)');
  console.log('   DELETE /api/tarefas/:id      (protegido)');
  console.log('   GET    /api/admin/stats      (apenas admin)');
  console.log('   GET    /api/admin/usuarios   (apenas admin)');
  console.log('   PUT    /api/admin/usuarios/:id/role  (apenas admin)');
  console.log('   DELETE /api/admin/usuarios/:id       (apenas admin)\n');
});
