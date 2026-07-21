// routes/tarefas.js — CRUD completo de tarefas
// Todas as rotas aqui são protegidas pelo middleware de autenticação
// Versão adaptada para MySQL (sem RETURNING, sem COALESCE com params)

const express = require('express');
const db      = require('../db');

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/tarefas
// Lista todas as tarefas do usuário logado
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT id, titulo, descricao, feito, prioridade, criado_em
       FROM tarefas
       WHERE usuario_id = ?
       ORDER BY criado_em DESC`,
      [req.usuario.id] // req.usuario vem do middleware JWT
    );

    res.json(resultado.rows);

  } catch (err) {
    console.error('Erro ao listar tarefas:', err);
    res.status(500).json({ erro: 'Erro ao buscar tarefas.' });
  }
});

// ─────────────────────────────────────────
// POST /api/tarefas
// Cria uma nova tarefa
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const { titulo, descricao, prioridade } = req.body;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ erro: 'O título da tarefa é obrigatório.' });
  }

  try {
    // MySQL não tem RETURNING — primeiro insere, depois busca pelo insertId
    const insercao = await db.query(
      `INSERT INTO tarefas (titulo, descricao, prioridade, usuario_id)
       VALUES (?, ?, ?, ?)`,
      [titulo.trim(), descricao || null, prioridade || 'media', req.usuario.id]
    );

    const novoId = insercao.rows.insertId;

    const resultado = await db.query(
      `SELECT id, titulo, descricao, feito, prioridade, criado_em
       FROM tarefas WHERE id = ?`,
      [novoId]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (err) {
    console.error('Erro ao criar tarefa:', err);
    res.status(500).json({ erro: 'Erro ao criar tarefa.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/tarefas/:id
// Atualiza uma tarefa (título, feito, prioridade)
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, feito, prioridade } = req.body;

  try {
    // Busca a tarefa atual primeiro (precisa existir e ser do usuário logado)
    const atual = await db.query(
      'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
      [id, req.usuario.id]
    );

    if (atual.rows.length === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    const tarefaAtual = atual.rows[0];

    // Mescla os campos enviados com os valores que já existiam
    // (equivalente ao COALESCE do PostgreSQL, mas feito em JS)
    const novoTitulo     = titulo     !== undefined ? titulo     : tarefaAtual.titulo;
    const novaDescricao  = descricao  !== undefined ? descricao  : tarefaAtual.descricao;
    const novoFeito      = feito      !== undefined ? feito      : tarefaAtual.feito;
    const novaPrioridade = prioridade !== undefined ? prioridade : tarefaAtual.prioridade;

    await db.query(
      `UPDATE tarefas
       SET titulo = ?, descricao = ?, feito = ?, prioridade = ?, atualizado_em = NOW()
       WHERE id = ? AND usuario_id = ?`,
      [novoTitulo, novaDescricao, novoFeito, novaPrioridade, id, req.usuario.id]
    );

    const resultado = await db.query(
      'SELECT id, titulo, descricao, feito, prioridade FROM tarefas WHERE id = ?',
      [id]
    );

    res.json(resultado.rows[0]);

  } catch (err) {
    console.error('Erro ao atualizar tarefa:', err);
    res.status(500).json({ erro: 'Erro ao atualizar tarefa.' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/tarefas/:id
// Remove uma tarefa
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Confirma que a tarefa existe e pertence ao usuário antes de apagar
    const existe = await db.query(
      'SELECT id FROM tarefas WHERE id = ? AND usuario_id = ?',
      [id, req.usuario.id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    await db.query('DELETE FROM tarefas WHERE id = ? AND usuario_id = ?', [id, req.usuario.id]);

    res.json({ mensagem: 'Tarefa removida com sucesso.', id: Number(id) });

  } catch (err) {
    console.error('Erro ao deletar tarefa:', err);
    res.status(500).json({ erro: 'Erro ao remover tarefa.' });
  }
});

module.exports = router;
