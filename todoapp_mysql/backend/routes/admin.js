// routes/admin.js — Rotas exclusivas do painel de administrador
// Todas protegidas por: autenticar (JWT válido) + apenasAdmin (role = 'admin')

const express = require('express');
const db      = require('../db');

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/admin/usuarios
// Lista todos os usuários cadastrados
// ─────────────────────────────────────────
router.get('/usuarios', async (req, res) => {
  try {
    // Busca todos os usuários — NUNCA retorna a senha_hash por segurança
    const resultado = await db.query(
      `SELECT id, nome, email, role, criado_em
       FROM usuarios
       ORDER BY criado_em DESC`
    );

    res.json(resultado.rows);

  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/stats
// Retorna números gerais do sistema
// ─────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsuarios] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM usuarios'),
    ]);
    const [totalTarefas] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM tarefas'),
    ]);
    const [tarefasConcluidas] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM tarefas WHERE feito = true'),
    ]);
    const [usuariosAdmin] = await Promise.all([
      db.query("SELECT COUNT(*) AS total FROM usuarios WHERE role = 'admin'"),
    ]);

    res.json({
      totalUsuarios:     totalUsuarios.rows[0].total,
      totalTarefas:      totalTarefas.rows[0].total,
      tarefasConcluidas: tarefasConcluidas.rows[0].total,
      usuariosAdmin:     usuariosAdmin.rows[0].total,
    });

  } catch (err) {
    console.error('Erro ao buscar stats:', err);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas.' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/usuarios/:id/tarefas
// Lista as tarefas de um usuário específico
// ─────────────────────────────────────────
router.get('/usuarios/:id/tarefas', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT id, titulo, descricao, feito, prioridade, criado_em
       FROM tarefas
       WHERE usuario_id = ?
       ORDER BY criado_em DESC`,
      [req.params.id]
    );

    res.json(resultado.rows);

  } catch (err) {
    console.error('Erro ao buscar tarefas do usuário:', err);
    res.status(500).json({ erro: 'Erro ao buscar tarefas.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/admin/usuarios/:id/role
// Promove ou rebaixa um usuário (admin ↔ user)
// ─────────────────────────────────────────
router.put('/usuarios/:id/role', async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ erro: 'Role inválido. Use "user" ou "admin".' });
  }

  // Impede o admin de remover seu próprio acesso acidentalmente
  if (Number(req.params.id) === req.usuario.id && role === 'user') {
    return res.status(400).json({ erro: 'Você não pode remover seu próprio acesso de admin.' });
  }

  try {
    await db.query('UPDATE usuarios SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ mensagem: `Usuário atualizado para "${role}" com sucesso.` });

  } catch (err) {
    console.error('Erro ao atualizar role:', err);
    res.status(500).json({ erro: 'Erro ao atualizar permissão.' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/admin/usuarios/:id
// Remove um usuário e todas as suas tarefas
// ─────────────────────────────────────────
router.delete('/usuarios/:id', async (req, res) => {
  if (Number(req.params.id) === req.usuario.id) {
    return res.status(400).json({ erro: 'Você não pode remover sua própria conta pelo painel.' });
  }

  try {
    await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Usuário removido com sucesso.' });

  } catch (err) {
    console.error('Erro ao remover usuário:', err);
    res.status(500).json({ erro: 'Erro ao remover usuário.' });
  }
});

module.exports = router;
