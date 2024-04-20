const express = require('express');
const app = express();
const PORT = 3000;
const pgp = require('pg-promise')()
const db = pgp('postgresql://postgres:postgres123@db:5432/elderDB')
const bcrypt = require('bcrypt')

// Middleware para autorização
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  const [email, password] = authHeader.split(':');

  db.oneOrNone('SELECT email, psw FROM terapeuta WHERE email = $1',[email])
  .then((user) => {
    if (!user) { return res.status(401).json({ error: 'Unauthorized' }); }
    bcrypt.compare(password, user.psw, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      next();
    });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

// Endpoint para teste de autorização
app.get('/api/autorizado', (req, res) => {
  console.log(req.headers)
  res.json(
    { 
      message: 'Você está autorizado a acessar este recurso',
    }
  );
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor Express em execução na porta ${PORT}`);
});
