-- =============================================
-- TaskFlow - Schema do Banco de Dados (PostgreSQL / Supabase)
-- =============================================
-- No Supabase, cole este conteúdo no SQL Editor e clique em RUN.
-- Não precisa criar o banco: o Supabase já fornece um pronto.

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  role       VARCHAR(20) DEFAULT 'user',
  criado_em  TIMESTAMP DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id            SERIAL PRIMARY KEY,
  titulo        VARCHAR(200) NOT NULL,
  descricao     TEXT,
  feito         BOOLEAN DEFAULT FALSE,
  prioridade    VARCHAR(10) DEFAULT 'media' CHECK (prioridade IN ('baixa','media','alta')),
  usuario_id    INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_em     TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON tarefas(usuario_id);
