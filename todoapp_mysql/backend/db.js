// db.js — Conexão com o MySQL
// O Pool gerencia múltiplas conexões simultâneas automaticamente

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  database: process.env.DB_NAME     || 'taskflow',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
});

// Testa a conexão ao iniciar
pool.getConnection()
  .then((conn) => {
    console.log('✅ Banco de dados conectado com sucesso!');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  });

// ── Wrapper de compatibilidade ──
// O mysql2 retorna [rows, fields] em vez de { rows: [...] } como o pg.
// Esta função normaliza o retorno para sempre devolver { rows: [...] },
// assim o resto do código (routes/auth.js e routes/tarefas.js) não precisa mudar.
async function query(sql, params = []) {
  const [result] = await pool.execute(sql, params);

  // SELECT retorna um array de linhas → mantemos como rows
  if (Array.isArray(result)) {
    return { rows: result };
  }

  // INSERT/UPDATE/DELETE retornam um objeto com insertId, affectedRows etc.
  // Empacotamos esse objeto dentro de "rows" para manter compatibilidade
  // com o código que espera resultado.rows.insertId
  return { rows: result };
}

module.exports = { query, pool };
