# Limanet API — login seguro (Render)

## 1. Gerar hash da senha (no PC)

```bash
cd limanet-api
npm install
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA',10))"
```

Copie o texto que começa com `$2a$` ou `$2b$`.

## 2. Deploy no Render

1. Envie esta pasta para um repositório GitHub (só `server.js` + `package.json`).
2. Render → **New** → **Web Service** → esse repositório.
3. **Runtime:** Node  
   **Build command:** `npm install`  
   **Start command:** `npm start`
4. **Environment:**

| Key | Exemplo |
|-----|---------|
| `JWT_SECRET` | frase-longa-aleatoria-2026 |
| `LOGIN_USER` | talili |
| `PASSWORD_HASH` | *(cole o hash bcrypt)* |
| `PROF_NOME` | Dr. Francisco Lima |
| `PROF_CRN` | CRN-4 26101256 |
| `ALLOWED_ORIGIN` | `true` (ou o URL do teu site) |

5. Depois do deploy, copie a URL, ex.: `https://limanet-api.onrender.com`

## 3. Frontend

No `Limanet.html`, a constante:

```javascript
const LIMANET_API = 'https://SEU-SERVICO.onrender.com';
```

## 4. Teste

```bash
curl -X POST https://SEU-SERVICO.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"user":"talili","pass":"SUA_SENHA"}'
```

Resposta esperada: `{"ok":true,"token":"...","nome":"...","crn":"..."}`
