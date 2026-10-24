/**
 * Limanet API — login seguro (Render)
 *
 * Variáveis de ambiente no Render:
 *   JWT_SECRET      — frase longa aleatória
 *   LOGIN_USER      — utilizador (ex: talili)
 *   PASSWORD_HASH   — hash bcrypt da senha
 *   ALLOWED_ORIGIN  — opcional, ex: https://sites.google.com
 *
 * Gerar hash localmente:
 *   npm install
 *   node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA',10))"
 */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3848;
const JWT_SECRET = process.env.JWT_SECRET || 'altere-jwt-secret-no-render';
const LOGIN_USER = (process.env.LOGIN_USER || 'talili').trim();
const PASSWORD_HASH = process.env.PASSWORD_HASH || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || true;

app.set('trust proxy', 1);
app.use(cors({ origin: ALLOWED_ORIGIN === 'true' ? true : ALLOWED_ORIGIN }));
app.use(express.json({ limit: '32kb' }));

app.get('/', (_req, res) => {
  res.json({
    service: 'limanet-api',
    ok: true,
    endpoints: ['POST /api/login', 'GET /api/me', 'GET /api/health']
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasPasswordHash: Boolean(PASSWORD_HASH),
    loginUserConfigured: Boolean(LOGIN_USER)
  });
});

app.post('/api/login', async (req, res) => {
  try {
    if (!PASSWORD_HASH) {
      return res.status(503).json({
        ok: false,
        msg: 'Servidor sem PASSWORD_HASH configurado no Render'
      });
    }

    const user = String((req.body && req.body.user) || '').trim();
    const pass = String((req.body && req.body.pass) || '');

    if (!user || !pass) {
      return res.status(400).json({ ok: false, msg: 'Informe utilizador e senha' });
    }

    if (user !== LOGIN_USER) {
      return res.status(401).json({ ok: false, msg: 'Utilizador ou senha inválidos' });
    }

    const match = await bcrypt.compare(pass, PASSWORD_HASH);
    if (!match) {
      return res.status(401).json({ ok: false, msg: 'Utilizador ou senha inválidos' });
    }

    const token = jwt.sign(
      {
        login: LOGIN_USER,
        nome: process.env.PROF_NOME || 'Dr. Francisco Lima',
        crn: process.env.PROF_CRN || 'CRN-4 26101256'
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      ok: true,
      token,
      nome: process.env.PROF_NOME || 'Dr. Francisco Lima',
      crn: process.env.PROF_CRN || 'CRN-4 26101256'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Erro interno no login' });
  }
});

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return res.status(401).json({ ok: false, msg: 'Token em falta' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ ok: false, msg: 'Sessão inválida ou expirada' });
  }
}

app.get('/api/me', auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.listen(PORT, () => {
  console.log('Limanet API a escutar na porta', PORT);
});
