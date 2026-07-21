-- =============================================
-- TaskFlow - Schema do Banco de Dados (MySQL)
-- =============================================

CREATE DATABASE IF NOT EXISTS taskflow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE taskflow;

-- Tabela de usuários
-- NOVIDADE: coluna "role" define se o usuário é 'user' ou 'admin'
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  role       VARCHAR(20) DEFAULT 'user',
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  titulo        VARCHAR(200) NOT NULL,
  descricao     TEXT,
  feito         BOOLEAN DEFAULT FALSE,
  prioridade    VARCHAR(10) DEFAULT 'media',
  usuario_id    INT,
  criado_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_prioridade CHECK (prioridade IN ('baixa','media','alta')),
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Index para buscas por usuário
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON tarefas(usuario_id);

-- =============================================
-- SE O BANCO JÁ EXISTIA: rode apenas esta linha
-- para adicionar a coluna role sem recriar tudo:
--
-- ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
--
-- =============================================

-- =============================================
-- Dados de exemplo para testes
-- =============================================
INSERT INTO usuarios (nome, email, senha_hash, role)
SELECT 'João Silva', 'joao@exemplo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'joao@exemplo.com');
