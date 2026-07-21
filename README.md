# ✅ TaskFlow — versão PostgreSQL (pronta para deploy)

App de tarefas com autenticação e painel de admin. Esta versão usa PostgreSQL
e está preparada para hospedagem gratuita: Supabase (banco) + Render (back) + Vercel (front).

## Rodar localmente
1. Instale PostgreSQL e crie um banco chamado taskflow
2. Rode backend/schema.sql nesse banco
3. Em backend, copie .env.example para .env e preencha (use a OPCAO 2 - local)
4. npm install e depois npm start
5. Abra frontend/index.html (a variavel API ja aponta para localhost)

## Colocar no ar
Veja o arquivo GUIA-DEPLOY.md
