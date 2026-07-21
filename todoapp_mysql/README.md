# ✅ TaskFlow — App de Lista de Tarefas (versão MySQL)

Projeto didático completo demonstrando a comunicação entre **Front-end**, **Back-end** e **Banco de Dados**.

> Esta versão usa **MySQL** em vez de PostgreSQL. As mudanças em relação à versão original estão explicadas na seção "O que mudou" no final deste arquivo.

---

## 🏗️ Arquitetura

```
frontend/
  index.html         → Interface do usuário (HTML + CSS + JS puro) — não mudou

backend/
  server.js          → Ponto de entrada, configura Express e rotas — não mudou
  db.js              → Conexão com o MySQL (driver mysql2)
  middleware/
    auth.js          → Verifica token JWT nas rotas protegidas — não mudou
  routes/
    auth.js          → POST /api/auth/login e /registro (queries adaptadas)
    tarefas.js       → GET / POST / PUT / DELETE /api/tarefas (queries adaptadas)
  schema.sql         → Cria as tabelas no banco (sintaxe MySQL)
  .env.example       → Exemplo de variáveis de ambiente (porta 3306)
```

---

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+
- MySQL 8+ ou MariaDB instalado e rodando
  (ou MySQL Workbench / XAMPP, se preferir uma interface gráfica)

### 1. Banco de Dados

Abra o MySQL (via terminal, MySQL Workbench, ou phpMyAdmin) e rode o arquivo `schema.sql`:

```bash
mysql -u root -p < backend/schema.sql
```

Isso cria o banco `taskflow` e as tabelas `usuarios` e `tarefas` automaticamente.

### 2. Back-end

```bash
cd backend

# Copie e configure o .env
cp .env.example .env
# Edite .env com seus dados do MySQL (usuário padrão geralmente é "root")

# Instale as dependências
npm install

# Inicie o servidor
node server.js
# → Servidor em http://localhost:3001
```

### 3. Front-end

Abra o arquivo `frontend/index.html` direto no navegador,
**ou** use o Live Server do VS Code (recomendado).

---

## 📡 API Endpoints

| Método | Rota                  | Autenticação | Descrição              |
|--------|-----------------------|:------------:|------------------------|
| GET    | `/api/ping`           | ❌           | Health check           |
| POST   | `/api/auth/registro`  | ❌           | Cria novo usuário      |
| POST   | `/api/auth/login`     | ❌           | Autentica usuário      |
| GET    | `/api/tarefas`        | ✅ JWT       | Lista tarefas          |
| POST   | `/api/tarefas`        | ✅ JWT       | Cria tarefa            |
| PUT    | `/api/tarefas/:id`    | ✅ JWT       | Atualiza tarefa        |
| DELETE | `/api/tarefas/:id`    | ✅ JWT       | Remove tarefa          |

---

## 🔄 O que mudou da versão PostgreSQL para MySQL

| Item | PostgreSQL (antes) | MySQL (agora) |
|---|---|---|
| Driver Node.js | `pg` | `mysql2` |
| Placeholder de query | `$1, $2, $3...` | `?, ?, ?...` (sempre o mesmo símbolo) |
| Retorno do INSERT | `RETURNING coluna` devolve a linha direto | Não existe `RETURNING`. Usamos `insertId` e fazemos um `SELECT` depois |
| Atualização parcial | `COALESCE($1, coluna)` no SQL | Buscamos a linha atual primeiro e mesclamos os campos em JavaScript |
| Tipo de texto longo | `TEXT` | `TEXT` (igual) |
| Auto incremento | `SERIAL` | `INT AUTO_INCREMENT` |
| Porta padrão | 5432 | 3306 |

**Importante:** criei uma função `query()` dentro de `db.js` que sempre devolve `{ rows: [...] }`, no mesmo formato que o `pg` usava. Isso significa que o restante do código (as rotas) não precisou ser totalmente reescrito — só os pontos onde a sintaxe SQL realmente muda (placeholders, RETURNING, COALESCE).
