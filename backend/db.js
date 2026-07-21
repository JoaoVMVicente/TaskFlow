// db.js — Conexão com o PostgreSQL (compatível com Supabase)

const { Pool } = require('pg');
require('dotenv').config();

// O Supabase exige conexão SSL. Em ambiente local sem SSL, a opção
// abaixo é ignorada sem causar problema.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Supabase fornece uma URL única
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase')
    ? { rejectUnauthorized: false }
    : false,
  // Fallback para variáveis separadas (uso local sem DATABASE_URL)
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('✅ Banco de dados conectado com sucesso!');
    release();
  }
});

module.exports = pool;
