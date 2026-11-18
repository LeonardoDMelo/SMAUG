# SMAUG — Documentação Completa do Projeto

> Guia detalhado para apresentação e estudo: o que é o SMAUG, como a arquitetura funciona, o que cada pasta/arquivo faz e como cada funcionalidade foi construída.

---

## 1. O que é o SMAUG?

**SMAUG** (nome inspirado no dragão colecionador de tesouros) é um **sistema web full-stack** para gerenciar uma **coleção pessoal de consoles e jogos**.

O usuário pode:

| Funcionalidade | Descrição |
|---|---|
| Autenticação | Registrar, login e sessão protegida com JWT |
| Consoles | CRUD completo (criar, listar, editar, excluir) com filtros |
| Jogos | CRUD completo com múltiplos gêneros, filtros e capa |
| Dashboard | Estatísticas financeiras e gráficos (Recharts) |
| Conquistas | Sistema de achievements estilo console (Xbox/PlayStation) |
| Quiz diário | 5 perguntas por dia; 100% libera conquista |
| Integração RAWG | Autocomplete ao cadastrar jogos buscando dados reais |
| Notificação | Toast + som ao desbloquear conquista |

Cada usuário só vê **os próprios dados** (isolamento por `userId`).

---

## 2. Stack tecnológica

### Backend
| Tecnologia | Papel |
|---|---|
| **Node.js** | Runtime JavaScript no servidor |
| **Express 5** | Framework HTTP (rotas, middlewares, JSON) |
| **Prisma 5** | ORM (mapeia modelos → PostgreSQL) |
| **PostgreSQL** | Banco de dados relacional |
| **bcryptjs** | Hash de senhas |
| **jsonwebtoken (JWT)** | Tokens de autenticação (validade 7 dias) |
| **axios** | Cliente HTTP para API externa (RAWG) |
| **cors** | Permite o frontend (outra porta) chamar a API |
| **dotenv** | Carrega variáveis do arquivo `.env` |
| **nodemon** | Reinicia o servidor ao salvar arquivos (dev) |

### Frontend
| Tecnologia | Papel |
|---|---|
| **React 19** | UI em componentes |
| **Vite 6** | Bundler/dev server rápido |
| **React Router DOM 7** | Rotas no browser (`/login`, `/games`, etc.) |
| **Axios** | Chamadas HTTP para a API |
| **Tailwind CSS 3** | Estilização utility-first |
| **Recharts** | Gráficos no Dashboard |
| **lucide-react** | Ícones (Trophy, Gamepad2, Tv, etc.) |
| **Web Audio API** | Som sintético de conquista (sem arquivo de áudio) |

### Externas
| Serviço | Uso |
|---|---|
| **RAWG API** (`api.rawg.io`) | Busca nome, capa, gêneros, sinopse de jogos reais |

---

## 3. Visão geral da arquitetura

```
┌─────────────────────┐         HTTP/JSON          ┌─────────────────────┐
│   FRONTEND (Vite)   │  ───────────────────────►  │   BACKEND (Express) │
│   React + Tailwind  │   Authorization: Bearer    │   Porta 3000        │
│   Porta 5173        │  ◄───────────────────────  │                     │
└─────────────────────┘                            └──────────┬──────────┘
                                                              │
                                                              │ Prisma Client
                                                              ▼
                                                   ┌─────────────────────┐
                                                   │   PostgreSQL        │
                                                   │   banco: smaug      │
                                                   └─────────────────────┘
                                                              ▲
                   ┌─────────────────────┐                    │
                   │   RAWG API          │ ◄── backend chama ─┘
                   │   (dados de jogos)  │     via axios
                   └─────────────────────┘
```

**Fluxo típico:**

1. Usuário interage na tela React.
2. Frontend chama `http://localhost:3000/api/...` com Axios.
3. Se a rota for protegida, envia o JWT no header `Authorization: Bearer <token>`.
4. Middleware valida o token e coloca `req.userId`.
5. Controller valida dados, chama Prisma (e às vezes services).
6. Resposta JSON volta ao frontend, que atualiza a UI (e pode disparar toast de conquista).

---

## 4. Estrutura de pastas

```
smaug/
├── DOCUMENTACAO.md          ← este arquivo
├── .gitignore
├── package.json             ← deps soltas na raiz (legado; o app real está em backend/ e frontend/)
│
├── backend/
│   ├── .env                 ← SECRETS locais (NÃO vai pro Git)
│   ├── .env.example         ← modelo sem secrets
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma    ← modelos do banco
│   │   ├── seed.js          ← popula conquistas padrão
│   │   └── migrations/      ← histórico SQL das mudanças no banco
│   └── src/
│       ├── server.js        ← ponto de entrada (listen na porta)
│       ├── app.js           ← monta Express + rotas
│       ├── config/
│       │   └── prisma.js    ← instância única do PrismaClient
│       ├── middlewares/
│       │   └── authMiddleware.js
│       ├── utils/
│       │   └── jwt.js       ← signToken / verifyToken
│       ├── routes/          ← só define URLs → controllers
│       ├── controllers/     ← lógica HTTP (req/res)
│       └── services/        ← regras de negócio reutilizáveis
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx         ← ReactDOM.createRoot
        ├── index.css        ← diretivas Tailwind
        ├── App.jsx          ← Router + Providers
        ├── services/
        │   └── api.js       ← Axios + interceptor JWT
        ├── context/
        │   ├── AuthContext.jsx
        │   └── AchievementToastContext.jsx
        ├── components/      ← pedaços reutilizáveis de UI
        ├── pages/           ← uma tela por rota
        ├── constants/
        │   └── catalog.js   ← listas fixas (fabricantes, mídias, consoles)
        └── utils/
            └── achievementSound.js
```

### Por que essa divisão no backend?

| Camada | Responsabilidade |
|---|---|
| **routes** | “Qual URL chama qual função?” — sem regra de negócio |
| **controllers** | Recebe `req`, valida, chama Prisma/services, devolve `res` |
| **services** | Lógica que pode ser reusada (conquistas, quiz, RAWG) |
| **middlewares** | Código que roda *antes* do controller (ex.: autenticar) |
| **config/utils** | Infraestrutura (banco, JWT) |

---

## 5. Banco de dados (Prisma + PostgreSQL)

Arquivo central: `backend/prisma/schema.prisma`.

### 5.1 Modelo `User`
- `id` (UUID), `name`, `email` (único), `password` (hash bcrypt), `createdAt`
- Relacionamentos: vários `Console`, `Game`, `UserAchievement`, `DailyQuiz`

### 5.2 Modelo `Console`
Campos principais: nome, data de lançamento, fabricante, geração, tipo de mídia, array de URLs de imagens, preço pago, valor estimado, nota, trivia opcional.

- Sempre ligado a um `userId` (dono).
- Pode ter vários `Game` (relação opcional via `consoleId`).
- `onDelete: Cascade` no User → apagar usuário apaga consoles.

### 5.3 Modelo `Game`
- `genres` é **`String[]`** (array) → um jogo pode ter vários gêneros.
- `consoleName` é texto do catálogo (ex.: `"PlayStation 2"`), **obrigatório**.
- `consoleId` é **opcional**: se o usuário possui um console com o mesmo nome cadastrado, o backend vincula automaticamente; senão fica `null`.
- Assim o usuário pode cadastrar jogo de um console que ainda não tem na coleção física.

### 5.4 Modelo `Achievement` + `UserAchievement`
- `Achievement`: catálogo global (`code` único: `FIRST_CONSOLE`, `FIRST_GAME`, etc.).
- `UserAchievement`: tabela de junção (quem desbloqueou o quê e quando).
- `@@unique([userId, achievementId])` impede desbloquear a mesma conquista duas vezes.

### 5.5 Modelo `DailyQuiz`
- Um registro por usuário **por dia** (`@@unique([userId, date])`).
- `questions` é `Json` (as 5 perguntas salvas no momento da criação).
- `answered` + `score` guardam se já respondeu e quantos acertos.

### Diagrama simplificado de relações

```
User 1───* Console 1───* Game (opcional via consoleId)
User 1───* Game
User 1───* UserAchievement *───1 Achievement
User 1───* DailyQuiz
```

### Migrations e seed
- `npx prisma migrate` aplica SQL em `prisma/migrations/`.
- `npm run seed` (ou `npx prisma db seed`) roda `seed.js` e faz **upsert** das 4 conquistas padrão.

---

## 6. Backend — como tudo sobe

### 6.1 `server.js`
```js
require('dotenv').config();   // lê .env
const app = require('./app');
app.listen(PORT || 3000);
```
Só sobe o servidor. A configuração de rotas fica em `app.js`.

### 6.2 `app.js`
1. Cria `express()`.
2. `cors()` → frontend na porta 5173 pode chamar a API.
3. `express.json()` → body JSON vira `req.body`.
4. `require('./services/achievementService')` → carrega o EventEmitter (listeners registrados).
5. Monta prefixes:

| Prefixo | Módulo |
|---|---|
| `/api/auth` | authRoutes |
| `/api/consoles` | consoleRoutes |
| `/api/games` | gameRoutes |
| `/api/dashboard` | dashboardRoutes |
| `/api/achievements` | achievementRoutes |
| `/api/quiz` | quizRoutes |
| `/api/external` | externalGameRoutes |

### 6.3 Variáveis de ambiente (`.env`)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
RAWG_API_KEY="..."
```
O `.gitignore` bloqueia `.env` no Git; só sobe `.env.example`.

---

## 7. Autenticação (ponta a ponta)

### Registro (`POST /api/auth/register`)
1. Valida `name`, `email`, `password`.
2. Verifica se email já existe → 409.
3. `bcrypt.hash(password, 10)` — senha **nunca** fica em texto puro.
4. Cria usuário no banco.
5. Gera JWT com `{ userId }` válido por **7 dias**.
6. Retorna `{ token, user }` (sem a senha).

### Login (`POST /api/auth/login`)
1. Busca usuário por email.
2. `bcrypt.compare` com a senha digitada.
3. Se ok → mesmo formato de resposta com JWT.

### Middleware `authMiddleware`
Usado em **todas** as rotas privadas:
1. Lê header `Authorization: Bearer <token>`.
2. `jwt.verify` com `JWT_SECRET`.
3. Coloca `req.userId = decoded.userId`.
4. Se falhar → 401.

### `GET /api/auth/me`
Retorna dados do usuário logado (usado pelo frontend ao recarregar a página).

### No frontend (`AuthContext`)
- Guarda `token` no `localStorage`.
- Ao montar, se há token → chama `/auth/me`.
- `api.js` tem **interceptor**: em toda request, injeta o Bearer token automaticamente.
- `PrivateRoute`: se não autenticado, redireciona para `/login`.

---

## 8. CRUD de Consoles

### Rotas (todas com `authMiddleware`)
| Método | URL | Ação |
|---|---|---|
| POST | `/api/consoles` | Criar |
| GET | `/api/consoles` | Listar (+ filtros query) |
| GET | `/api/consoles/:id` | Detalhe (+ jogos vinculados) |
| PUT | `/api/consoles/:id` | Atualizar |
| DELETE | `/api/consoles/:id` | Remover |

### Isolamento
Toda query inclui `userId: req.userId`. Um usuário **não consegue** editar/apagar console de outro.

### Filtros na listagem
Query params: `manufacturer`, `generation`, `mediaType`.

### Delete
Usa **transação Prisma**:
1. Apaga jogos com aquele `consoleId` do mesmo usuário.
2. Apaga o console.
Assim evita erro de foreign key.

### Frontend
- Página `Consoles.jsx`: lista em cards, filtros, botões editar/excluir.
- `ConsoleFormModal.jsx`: formulário create/edit.
- Selects vêm de `constants/catalog.js` (`MANUFACTURERS`, `MEDIA_TYPES`, `CONSOLES`).
- Após criar, chama `notifyAchievements(unlockedAchievements)`.

---

## 9. CRUD de Jogos

### Rotas
Mesmo padrão REST de consoles em `/api/games`.

### Normalização de gêneros
Função `normalizeGenres`:
- Aceita array `genres`, ou string com `/`, ou legado `genre`.
- Remove vazios e duplicatas (`Set`).

### Vínculo com console
Ao criar/atualizar:
```js
const ownedConsole = await prisma.console.findFirst({
  where: { userId, name: consoleName },
});
// consoleId = ownedConsole?.id || null
```

### Filtros avançados
- `genres` / `genre` → Prisma `hasSome` (jogo que tenha **pelo menos um** dos gêneros).
- `consoleNames` / `consoleName` → `in` (vários consoles).
- `saga`, `developer` → igualdade.

### Frontend (`GameFormModal`)
1. Campo de busca RAWG com **debounce** (~300–400ms).
2. Usuário digita → `GET /api/external/games/search?query=...`.
3. Clica num resultado → `GET /api/external/games/:id` preenche nome, data, developer, gêneros, capa, sinopse.
4. Usuário ainda escolhe `consoleName`, preços, rating, etc.
5. Submit → create/update local no banco SMAUG (não depende da RAWG depois).

---

## 10. Dashboard / Estatísticas

`GET /api/dashboard/stats` (autenticado).

Em paralelo (`Promise.all`):
- Contagem de consoles e jogos.
- Soma de `pricePaid` e `estimatedValue` (consoles + jogos).
- `groupBy` jogos por `consoleName`.
- Lista de gêneros → conta frequência no JS.

Resposta:
```json
{
  "totalConsoles": 3,
  "totalGames": 12,
  "totalSpent": 1500,
  "totalEstimatedValue": 2200,
  "gamesByConsole": [{ "name": "PS2", "value": 5 }],
  "gamesByGenre": [{ "name": "RPG", "value": 4 }]
}
```

Frontend `Dashboard.jsx` usa **Recharts** (pizza/barra) para visualizar distribuição.

---

## 11. Sistema de Conquistas (detalhado)

### 11.1 Catálogo (seed)
| Código | Título | Como desbloqueia |
|---|---|---|
| `FIRST_CONSOLE` | Primeiro Hardware | 1º console cadastrado |
| `FIRST_GAME` | Primeiro Jogo | 1º jogo cadastrado |
| `COLLECTOR_10` | Colecionador | consoles + jogos ≥ 10 |
| `QUIZ_MASTER` | Mestre do Quiz | 5/5 no quiz diário |

### 11.2 Service `achievementService.js`
Função central `checkAndGrantAchievement(userId, code)`:
1. Busca achievement pelo `code`.
2. Se usuário já tem → retorna `null` (não duplica).
3. Cria `UserAchievement`.
4. Retorna objeto formatado `{ id, code, title, description, icon, unlockedAt }`.

Processadores:
- `processConsoleCreated` → FIRST_CONSOLE + talvez COLLECTOR_10
- `processGameCreated` → FIRST_GAME + talvez COLLECTOR_10
- `processQuizMaster` → QUIZ_MASTER

Também existe um **EventEmitter** (padrão Observer) com listeners `CONSOLE_CREATED`, `GAME_CREATED`, `QUIZ_MASTER` — útil para desacoplar; na prática os controllers chamam as funções `process*` diretamente e devolvem `unlockedAchievements` na resposta HTTP (necessário para o toast imediato).

### 11.3 Controllers de criação
Ao criar console/jogo:
```js
const unlockedAchievements = await processXxx(req.userId);
return res.status(201).json({ ...entity, unlockedAchievements });
```

### 11.4 Rotas admin de conquistas
| Método | URL | Ação |
|---|---|---|
| GET | `/api/achievements` | Lista todas + flag `unlocked` do usuário |
| POST | `/api/achievements/grant` | Força unlock de um `code` |
| POST | `/api/achievements/grant-all` | Unlock de todas |
| DELETE | `/api/achievements/unlocked` | Limpa todas do usuário |
| DELETE | `/api/achievements/unlocked/:code` | Revoga uma |

### 11.5 Toast + som (frontend)
1. `AchievementToastProvider` envolve o `App`.
2. `notifyAchievements(lista)`:
   - Toca `playAchievementSound()` (Web Audio: notas em triângulo subindo, ~0.85s).
   - Empilha toasts no **canto superior direito**, um a um com delay.
   - Auto-dismiss ~5.2s.
3. Visual: faixa âmbar + ícone + “Conquista desbloqueada” + título/descrição (estilo Xbox/PS).
4. Chamado após: criar console, criar jogo, enviar quiz, grant admin.

---

## 12. Quiz diário

### Service
- 5 perguntas **estáticas** sobre games/consoles (`STATIC_QUESTIONS`).
- `getOrCreateTodayQuiz(userId)`:
  - Calcula o “hoje” em UTC (início/fim do dia).
  - Se já existe registro → retorna.
  - Senão cria com as perguntas em JSON.

### Segurança das respostas
`sanitizeQuiz`:
- Se **ainda não respondeu** → remove `correctAnswer` de cada pergunta (frontend não “cola”).
- Se já respondeu → devolve completo para mostrar acertos/erros.

### Submit
1. Exige array de 5 índices.
2. Se já `answered` → 400.
3. Calcula `score` comparando com `correctAnswer`.
4. Se `score === 5` → `processQuizMaster`.
5. Retorna quiz sanitizado + `unlockedAchievements`.

Regra de negócio: **um quiz por usuário por dia**.

---

## 13. Integração RAWG

### Por que no backend?
A API key fica no servidor (`.env`). O browser **nunca** vê a chave.

### Service `rawgService.js`
- Axios com `baseURL: https://api.rawg.io/api`.
- `searchGames(query)` → top 10 resultados resumidos.
- `getGameDetails(id)` → detalhes + limpa HTML da descrição (`stripHtml`).

### Rotas
- `GET /api/external/games/search?query=zelda`
- `GET /api/external/games/:id`

Ambas autenticadas (só usuário logado usa a cota da key).

---

## 14. Frontend — navegação e páginas

### `App.jsx`
```
AuthProvider
  └── AchievementToastProvider
        └── BrowserRouter
              ├── /login, /register   (públicas)
              ├── /                   Dashboard (privada)
              ├── /consoles
              ├── /games
              ├── /achievements
              ├── /quiz
              └── * → redireciona /
```

### Páginas
| Arquivo | Função |
|---|---|
| `Login.jsx` / `Register.jsx` | Formulários de auth |
| `Dashboard.jsx` | Cards de totais + gráficos |
| `Consoles.jsx` | Lista, filtros, abre modal, confirma delete |
| `Games.jsx` | Idem para jogos (filtros multi-gênero/console) |
| `Achievements.jsx` | Grade locked/unlocked + botões admin |
| `Quiz.jsx` | Fluxo perguntas → resultado |

### Componentes importantes
| Componente | Função |
|---|---|
| `Navbar` | Links + nome do usuário + logout |
| `PrivateRoute` | Gate de autenticação |
| `ConsoleFormModal` / `GameFormModal` | Create/Edit |
| Contexts | Estado global de auth e toasts |

### Estilo
- Tailwind: classes utilitárias (`bg-slate-950`, `text-amber-400`, etc.).
- Tema escuro gamer (slate + âmbar nas conquistas).
- `index.css` só importa as camadas `@tailwind base/components/utilities`.

---

## 15. Mapa completo da API

### Auth
| Método | Endpoint | Auth? |
|---|---|---|
| POST | `/api/auth/register` | Não |
| POST | `/api/auth/login` | Não |
| GET | `/api/auth/me` | Sim |

### Consoles / Games / Dashboard
CRUD padrão sob `/api/consoles` e `/api/games` + `GET /api/dashboard/stats` (todos autenticados).

### Achievements / Quiz / External
Conforme seções 11–13.

Códigos HTTP usados com frequência:
- `200` OK, `201` Created, `204` No Content (delete)
- `400` validação, `401` não autenticado, `404` não achou, `409` conflito
- `500` erro interno, `502` falha em API externa

---

## 16. Segurança — decisões importantes

1. **Senha hasheada** (bcrypt, salt rounds 10).
2. **JWT** no header, não em cookie (simples para SPA).
3. **Isolamento por `userId`** em todo CRUD.
4. **Antes de update/delete**: `findFirst({ id, userId })` — se não for dono, 404.
5. **Quiz** não vaza `correctAnswer` antes de responder.
6. **RAWG_API_KEY** e `JWT_SECRET` só no servidor.
7. `.env` no `.gitignore`.

---

## 17. Como rodar localmente (passo a passo)

### Pré-requisitos
- Node.js
- PostgreSQL rodando com um banco criado (ex.: `smaug`)

### Backend
```bash
cd backend
cp .env.example .env   # editar DATABASE_URL, JWT_SECRET, RAWG_API_KEY
npm install
npx prisma migrate deploy   # ou migrate dev
npx prisma generate
npm run seed
npm run dev                 # http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Abrir o browser em `http://localhost:5173`, registrar usuário e usar o sistema.

---

## 18. Fluxos para explicar na apresentação (roteiro sugerido)

### Slide / momento 1 — Problema e solução
“Queria organizar minha coleção de games com valores, filtros e um toque divertido de conquistas.”

### Momento 2 — Arquitetura
Desenhar: React ↔ Express ↔ PostgreSQL (+ RAWG).
Citar separação routes → controllers → services.

### Momento 3 — Modelo de dados
Mostrar `schema.prisma`: User no centro, isolamento, genres como array, quiz diário único.

### Momento 4 — Auth
Demo: register → token no localStorage → interceptor → PrivateRoute.

### Momento 5 — CRUD + filtros
Cadastrar console/jogo, filtrar, editar, excluir com confirmação.

### Momento 6 — RAWG
Digitar nome de um jogo famoso e mostrar autocomplete preenchendo o form.

### Momento 7 — Dashboard
Mostrar totais e gráficos Recharts.

### Momento 8 — Conquistas + toast
Cadastrar o primeiro item e mostrar notificação + som estilo console.
Explicar `unlockedAchievements` na resposta da API.

### Momento 9 — Quiz
Responder o diário; com 5/5 ganhar QUIZ_MASTER.

### Momento 10 — Encerramento técnico
Stack, GitHub, o que faria a seguir (deploy, mais conquistas, perguntas dinâmicas, upload de imagens, etc.).

---

## 19. Glossário rápido

| Termo | Significado neste projeto |
|---|---|
| **CRUD** | Create, Read, Update, Delete |
| **JWT** | Token assinado que prova quem é o usuário |
| **ORM** | Prisma traduz JS ↔ SQL |
| **Middleware** | Função no meio do caminho da request |
| **Interceptor** | No Axios, altera request/response globalmente |
| **Context** | Estado React compartilhado sem prop drilling |
| **Debounce** | Espera o usuário parar de digitar antes de buscar |
| **Upsert** | Update se existe, Create se não |
| **Cascade** | Apagar pai apaga filhos automaticamente |
| **hasSome** | Filtro Prisma: array contém algum dos valores |

---

## 20. Resumo em uma frase

O SMAUG é uma SPA React autenticada por JWT que conversa com uma API Express; a API persiste coleções multi-usuário no PostgreSQL via Prisma, enriquece cadastros de jogos com a RAWG, calcula estatísticas, roda um quiz diário e concede conquistas com feedback visual/sonoro no estilo dos consoles modernos.
`)