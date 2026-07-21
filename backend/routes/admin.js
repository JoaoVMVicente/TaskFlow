// routes/admin.js — Rotas do painel de administrador (PostgreSQL)

const express = require('express');
const db      = require('../db');

const router = express.Router();

// GET /api/admin/usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT id, nome, email, role, criado_em FROM usuarios ORDER BY criado_em DESC`
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsuarios     = await db.query('SELECT COUNT(*) AS total FROM usuarios');
    const totalTarefas      = await db.query('SELECT COUNT(*) AS total FROM tarefas');
    const tarefasConcluidas = await db.query('SELECT COUNT(*) AS total FROM tarefas WHERE feito = true');
    const usuariosAdmin     = await db.query("SELECT COUNT(*) AS total FROM usuarios WHERE role = 'admin'");
    res.json({
      totalUsuarios:     Number(totalUsuarios.rows[0].total),
      totalTarefas:      Number(totalTarefas.rows[0].total),
      tarefasConcluidas: Number(tarefasConcluidas.rows[0].total),
      usuariosAdmin:     Number(usuariosAdmin.rows[0].total),
    });
  } catch (err) {
    console.error('Erro ao buscar stats:', err);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas.' });
  }
});

// GET /api/admin/usuarios/:id/tarefas
router.get('/usuarios/:id/tarefas', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT id, titulo, descricao, feito, prioridade, criado_em
       FROM tarefas WHERE usuario_id = $1 ORDER BY criado_em DESC`,
      [req.params.id]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao buscar tarefas do usuário:', err);
    res.status(500).json({ erro: 'Erro ao buscar tarefas.' });
  }
});

// PUT /api/admin/usuarios/:id/role
router.put('/usuarios/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ erro: 'Role inválido. Use "user" ou "admin".' });
  }
  if (Number(req.params.id) === req.usuario.id && role === 'user') {
    return res.status(400).json({ erro: 'Você não pode remover seu próprio acesso de admin.' });
  }
  try {
    await db.query('UPDATE usuarios SET role = $1 WHERE id = $2', [role, req.params.id]);
    res.json({ mensagem: `Usuário atualizado para "${role}" com sucesso.` });
  } catch (err) {
    console.error('Erro ao atualizar role:', err);
    res.status(500).json({ erro: 'Erro ao atualizar permissão.' });
  }
});

// DELETE /api/admin/usuarios/:id
router.delete('/usuarios/:id', async (req, res) => {
  if (Number(req.params.id) === req.usuario.id) {
    return res.status(400).json({ erro: 'Você não pode remover sua própria conta pelo painel.' });
  }
  try {
    await db.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover usuário:', err);
    res.status(500).json({ erro: 'Erro ao remover usuário.' });
  }
});

module.exports = router;
