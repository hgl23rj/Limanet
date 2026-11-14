# Limanet — API + Frontend

Sistema de nutrição (HTML) com API de login seguro no Render.

Repositório: [hgl23rj/Limanet](https://github.com/hgl23rj/Limanet)

---

## CI/CD automático

### 1) GitHub Actions (CI) — já configurado

Ficheiro: `.github/workflows/ci.yml`

Em cada **push** ou **pull request** para `main`:

- instala dependências Node e valida `server.js`
- verifica se `index.html` existe e contém marcadores do Limanet

Ver runs: **Actions** no GitHub → workflow **CI Limanet**.

### 2) Render (CD / deploy automático)

O deploy em produção fica no **Render** (não no GitHub Actions).

1. [Render Dashboard](https://dashboard.render.com) → o serviço do Limanet (Web Service)
2. **Settings** → **Build & Deploy**
3. Confirme:
   - **Repository:** `hgl23rj/Limanet`
   - **Branch:** `main`
   - **Auto-Deploy:** **Yes** (ativado)
4. Comandos típicos:
   - **Build:** `npm install`
   - **Start:** `npm start`

Fluxo:

```text
Você faz push em main
    → GitHub Actions corre o CI
    → Render deteta o commit e faz deploy automático
```

Se o Auto-Deploy estiver **desligado**, use **Manual Deploy → Deploy latest commit**.

---

## API de login (Render)

### Gerar hash da senha (no PC)

```bash
npm install
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA',10))"
```

Copie o texto que começa com `$2a$` ou `$2b$`.

### Variáveis de ambiente no Render

| Key | Exemplo |
|-----|---------|
| `JWT_SECRET` | frase-longa-aleatoria-2026 |
| `LOGIN_USER` | talili |
| `PASSWORD_HASH` | *(cole o hash bcrypt)* |
| `PROF_NOME` | Dr. Francisco Lima |
| `PROF_CRN` | CRN-4 26101256 |
| `ALLOWED_ORIGIN` | `true` (ou o URL do teu site) |

### Teste

```bash
curl -X POST https://SEU-SERVICO.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"user":"talili","pass":"SUA_SENHA"}'
```

Resposta esperada: `{"ok":true,"token":"...","nome":"...","crn":"..."}`

---

## Frontend (`index.html`)

No HTML, a constante da API deve apontar para o serviço Render:

```javascript
const LIMANET_API = 'https://SEU-SERVICO.onrender.com';
```

Atualizar o site = atualizar `index.html` + **push** para `main` (com Auto-Deploy ligado no Render).
