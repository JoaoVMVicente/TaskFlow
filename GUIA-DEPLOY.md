# 🚀 Guia de Deploy — TaskFlow na internet (100% gratuito)

Vamos colocar o TaskFlow no ar na ordem correta: **banco → back-end → front-end**.

```
1º  Banco    →  Supabase   (PostgreSQL grátis, sem cartão)
2º  Back-end →  Render      (Node.js grátis)
3º  Front    →  Vercel      (site grátis)
```

Você vai precisar de uma conta no **GitHub** (grátis) porque Render e Vercel puxam o código de lá.

---

## PARTE 1 — Banco de dados no Supabase

1. Acesse **supabase.com** e crie uma conta (pode usar o GitHub).
2. Clique em **New Project**.
3. Dê um nome (ex: `taskflow`), crie uma **senha do banco** e guarde ela.
4. Escolha a região **South America (São Paulo)** e clique em **Create new project**.
5. Espere uns 2 minutos até o banco ficar pronto.
6. No menu lateral, abra o **SQL Editor**, clique em **New query**.
7. Cole todo o conteúdo do arquivo `backend/schema.sql` e clique em **Run**.
   - Deve aparecer "Success. No rows returned".
8. Agora pegue a URL de conexão: vá em **Project Settings** (engrenagem) → **Database**
   → seção **Connection string** → aba **URI**.
   - Vai ser algo como:
     `postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres`
   - Troque `[SUA-SENHA]` pela senha que você criou no passo 3.
   - **Guarde essa URL completa**, vamos usar no Render.

---

## PARTE 2 — Subir o código no GitHub

1. Acesse **github.com** e crie um repositório novo (ex: `taskflow`), pode ser público.
2. A forma mais fácil sem terminal: na página do repositório vazio, clique em
   **uploading an existing file** e arraste as pastas `backend` e `frontend`.
3. Confirme com **Commit changes**.

---

## PARTE 3 — Back-end no Render

1. Acesse **render.com** e crie conta com o GitHub.
2. Clique em **New +** → **Web Service**.
3. Conecte seu repositório `taskflow`.
4. Preencha:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Em **Environment Variables**, adicione:
   - `DATABASE_URL` = a URL completa do Supabase (da Parte 1, passo 8)
   - `JWT_SECRET` = qualquer texto longo e aleatório
   - (não precisa colocar PORT, o Render define sozinho)
6. Clique em **Create Web Service** e espere o deploy terminar.
7. No topo da página vai aparecer a URL do seu back-end, algo como:
   `https://taskflow-xxxx.onrender.com`
8. Teste abrindo `https://taskflow-xxxx.onrender.com/api/ping` no navegador.
   - Deve aparecer: `{"status":"ok","mensagem":"TaskFlow API funcionando!"}`

> ⚠️ No plano grátis do Render, o back-end "dorme" após 15 min sem uso.
> A primeira visita depois disso demora ~30s para acordar. É normal.

---

## PARTE 4 — Front-end na Vercel

1. **Antes de subir**, edite `frontend/index.html`. Procure por estas linhas no topo do `<script>`:

   ```javascript
   const API = 'http://localhost:3001/api';
   ```

   Troque pela URL do seu Render + `/api`:

   ```javascript
   const API = 'https://taskflow-xxxx.onrender.com/api';
   ```

   Salve e mande essa alteração para o GitHub.

2. Acesse **vercel.com** e crie conta com o GitHub.
3. Clique em **Add New** → **Project** e importe o repositório `taskflow`.
4. Em **Root Directory**, clique em **Edit** e selecione a pasta `frontend`.
5. Clique em **Deploy**.
6. Em ~1 minuto a Vercel te dá a URL final, algo como:
   `https://taskflow.vercel.app` — **esse é o seu site!**

---

## PARTE 5 — Fechar o CORS (segurança)

Depois que tudo estiver funcionando, volte no **Render** e adicione mais uma variável de ambiente:

- `FRONTEND_URL` = a URL da Vercel (ex: `https://taskflow.vercel.app`)

Isso faz o back-end aceitar requisições **só** do seu site, não de qualquer lugar.

---

## PARTE 6 — Virar admin

1. Acesse seu site na Vercel e **crie sua conta** normalmente.
2. Volte no Supabase → **SQL Editor** e rode (troque pelo seu e-mail):

   ```sql
   UPDATE usuarios SET role = 'admin' WHERE email = 'seu@email.com';
   ```

3. No site, faça **logout e login de novo**. O botão **⚙️ Painel Admin** vai aparecer.

Pronto! Seu TaskFlow está no ar e acessível de qualquer lugar. 🎉
