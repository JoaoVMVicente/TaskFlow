// middleware/auth.js — Verifica se o usuário está autenticado
// Este middleware roda ANTES das rotas protegidas

const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  // O front-end envia o token no header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // pega só a parte do token

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido. Faça login primeiro.' });
  }

  try {
    // Verifica se o token é válido e não expirou
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Injeta os dados do usuário na requisição
    next(); // Libera para a próxima função (a rota)
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado. Faça login novamente.' });
  }
}

module.exports = autenticar;
