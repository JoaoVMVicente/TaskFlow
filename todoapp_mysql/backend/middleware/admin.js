// middleware/admin.js — Verifica se o usuário autenticado é administrador
// Este middleware sempre roda DEPOIS do middleware de autenticação (auth.js)
// porque precisa que req.usuario já esteja preenchido com os dados do token

function apenasAdmin(req, res, next) {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({
      erro: 'Acesso negado. Esta rota é restrita a administradores.'
    });
  }
  next(); // é admin, libera para a rota
}

module.exports = apenasAdmin;
