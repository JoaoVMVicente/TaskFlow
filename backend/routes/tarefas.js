// routes/tarefas.js — CRUD de tarefas (PostgreSQL)

const express = require('express');
const db      = require('../db');

const router = express.Router();

// GET /api/tarefas
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT id, titulo, descricao, feito, prioridade, criado_em
       FROM tarefas WHERE usuario_id = $1 ORDER BY criado_em DESC`,
      [req.usuario.id]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao listar tarefas:', err);
    res.status(500).json({ erro: 'Erro ao buscar tarefas.' });
  }
});

// POST /api/tarefas
router.post('/', async (req, res) => {
  const { titulo, descricao, prioridade } = req.body;
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ erro: 'O título da tarefa é obrigatório.' });
  }
  try {
    const resultado = await db.query(
      `INSERT INTO tarefas (titulo, descricao, prioridade, usuario_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, titulo, descricao, feito, prioridade, criado_em`,
      [titulo.trim(), descricao || null, prioridade || 'media', req.usuario.id]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao criar tarefa:', err);
    res.status(500).json({ erro: 'Erro ao criar tarefa.' });
  }
});

// PUT /api/tarefas/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, feito, prioridade } = req.body;
  try {
    const resultado = await db.query(
      `UPDATE tarefas
       SET titulo        = COALESCE($1, titulo),
           descricao     = COALESCE($2, descricao),
           feito         = COALESCE($3, feito),
           prioridade    = COALESCE($4, prioridade),
           atualizado_em = NOW()
       WHERE id = $5 AND usuario_id = $6
       RETURNING id, titulo, descricao, feito, prioridade`,
      [titulo, descricao, feito, prioridade, id, req.usuario.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar tarefa:', err);
    res.status(500).json({ erro: 'Erro ao atualizar tarefa.' });
  }
});

// DELETE /api/tarefas/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query(
      'DELETE FROM tarefas WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [id, req.usuario.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }
    res.json({ mensagem: 'Tarefa removida com sucesso.', id: resultado.rows[0].id });
  } catch (err) {
    console.error('Erro ao deletar tarefa:', err);
    res.status(500).json({ erro: 'Erro ao remover tarefa.' });
  }
});

module.exports = router;
