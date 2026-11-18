# SMAUG

Gerenciador web da sua coleção de **consoles** e **jogos**.

O nome vem do dragão colecionador: cada usuário guarda o próprio tesouro — hardware, mídia física ou digital, valores, notas e conquistas estilo Xbox/PlayStation.

**Repositório:** [github.com/LeonardoDMelo/SMAUG](https://github.com/LeonardoDMelo/SMAUG)

---

## O que o sistema faz

- Conta com registro, login e sessão JWT (cada pessoa vê só os próprios dados)
- Cadastro completo de consoles (fabricante, geração, mídia, imagens, preços, nota)
- Cadastro completo de jogos (vários gêneros, saga, capa, sinopse, flag **versão digital**)
- Filtros na listagem (console, gênero, saga, desenvolvedora…)
- Dashboard com totais gastos/estimados e gráficos
- Conquistas com toast no canto da tela e som curto
- Quiz diário de 5 perguntas sobre videogames (gabaritar libera conquista)
- Autocomplete ao cadastrar jogo: clássicos de console + RAWG, com fallback na Steam se a RAWG estiver fora

---

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, Vite 6, Tailwind CSS 3, React Router, Axios, Recharts |
| Backend | Node.js, Express 5, Prisma 5, JWT, bcrypt |
| Banco | PostgreSQL |
| Extras | RAWG API, Steam Store (fallback), Web Audio API |

```
React (porta 5173)  ──HTTP + JWT──►  Express (porta 3000)  ──Prisma──►  PostgreSQL
                                              │
                                              └── RAWG / Steam / catálogo local
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL com um banco criado (exemplo: `smaug`)
- (Opcional) chave da [RAWG API](https://rawg.io/apidocs) para autocomplete mais completo

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/smaug?schema=public"
JWT_SECRET="troque-por-um-segredo-forte"
RAWG_API_KEY="sua_chave_rawg"
```

```bash
npm install
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run dev
```

API em **http://localhost:3000**.

Documentação interativa (Swagger): **http://localhost:3000/api-docs**

O seed cria só as conquistas (`FIRST_CONSOLE`, `FIRST_GAME`, `COLLECTOR_10`, `QUIZ_MASTER`). **Não existe usuário padrão** — registre uma conta na tela de cadastro.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Interface em **http://localhost:5173**.

---

## Funcionalidades em mais detalhe

### Autenticação
Senha hasheada com bcrypt. Token JWT no `localStorage`, enviado automaticamente pelo Axios. Rotas internas exigem login.

### Consoles e jogos
CRUD isolado por `userId`. Jogos podem existir mesmo sem o console físico cadastrado (`consoleName` obrigatório; `consoleId` opcional). Marque **Versão digital** quando não houver mídia física.

### Busca de jogos
1. Catálogo local de clássicos de console (Zelda, Mario, Halo, Chrono Trigger…)
2. RAWG, se a API responder
3. Steam, se a RAWG estiver fora

### Conquistas
Desbloqueiam ao cadastrar o primeiro console/jogo, ao chegar a 10 itens ou ao gabaritar o quiz. A API devolve `unlockedAchievements`; o frontend mostra o toast e toca o som.

### Quiz
Um conjunto por usuário por dia. Há um botão **Resetar quiz (demo)** para sortear outras perguntas na apresentação. O banco evita repetir as questões recentes.

---

## Estrutura do repositório

```
smaug/
├── backend/          API Express + Prisma
│   ├── prisma/       schema, migrations, seed
│   └── src/
│       ├── routes/       URLs → controllers
│       ├── controllers/  validação + resposta HTTP
│       ├── services/     conquistas, quiz, RAWG, Steam
│       ├── data/         catálogo local de jogos de console
│       └── middlewares/  JWT
└── frontend/         SPA React
    └── src/
        ├── pages/        uma tela por rota
        ├── components/   Navbar, modais
        └── context/      auth e toasts
```

Mapa pasta a pasta: [`docs/SMAUG-Pastas-e-Arquivos.pdf`](docs/SMAUG-Pastas-e-Arquivos.pdf)  
Como testar no Swagger: [`docs/SMAUG-Como-Testar-Swagger.pdf`](docs/SMAUG-Como-Testar-Swagger.pdf)  
Documentação completa para estudo/apresentação: [`DOCUMENTACAO.md`](DOCUMENTACAO.md)

---

## API (resumo)

Prefixo: `http://localhost:3000/api`

| Área | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Consoles | `GET/POST /consoles`, `GET/PUT/DELETE /consoles/:id` |
| Jogos | `GET/POST /games`, `GET/PUT/DELETE /games/:id` |
| Dashboard | `GET /dashboard/stats` |
| Conquistas | `GET /achievements`, grant / grant-all / revoke |
| Quiz | `GET /quiz/today`, `POST /quiz/submit`, `POST /quiz/reset` |
| Externo | `GET /external/games/search`, `GET /external/games/:id` |

Rotas privadas exigem header `Authorization: Bearer <token>`.

---

## Scripts

**Backend**

| Comando | Função |
|---|---|
| `npm run dev` | Sobe a API com nodemon |
| `npm start` | Sobe a API em modo produção |
| `npm run seed` | Recria as conquistas padrão |
| `npx prisma migrate deploy` | Aplica migrations no banco |
| `npx prisma studio` | Interface visual do banco |

**Frontend**

| Comando | Função |
|---|---|
| `npm run dev` | Vite na porta 5173 |
| `npm run build` | Build de produção |
| `npm run preview` | Serve o build localmente |

---

## Licença

ISC — projeto acadêmico / portfólio.
