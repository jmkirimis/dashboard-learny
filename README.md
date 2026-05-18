# dashboard-learny

Dashboard web do projeto **Learny** destinado aos pais e responsáveis. Permite gerenciar contas, acompanhar o progresso e a atividade dos filhos, enviar notificações e configurar o perfil. Comunica-se com a API Flask ([learny-mobile-api](https://github.com/Learny-Projeto-Integrador/learny-mobile-api)) por meio de proxies em API routes do Next.js, repassando o JWT armazenado em cookie HTTP-only.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** + **MUI 7** + **MUI X Date Pickers**
- **AWS S3** (`@aws-sdk/client-s3`) para upload de imagens de perfil
- **jsonwebtoken** para validação do token nas API routes
- **Recharts** para gráficos de atividade
- **Vitest** para testes
- Deploy automático via **Vercel**

## Pré-requisitos

- Node.js 20 ou superior
- npm (vem com o Node)
- Acesso à API `learny-mobile-api` em execução (local ou produção)
- Bucket S3 configurado com credenciais IAM

## Setup local

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd dashboard-learny

# 2. Instale as dependências
npm install

# 3. Configure o arquivo .env (veja a próxima seção)

# 4. Rode o servidor de desenvolvimento
npm run dev
```

O dashboard sobe em `http://localhost:3000`.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

| Variável                   | Descrição                                                         | Obrigatória |
|----------------------------|-------------------------------------------------------------------|-------------|
| `API_URL`                  | URL base da API Flask (ex.: `https://learny-mobile-api.onrender.com`)    | Sim         |
| `JWT_SECRET`               | Chave secreta para validar tokens JWT no middleware/API routes    | Sim         |
| `AWS_S3_REGION`            | Região do bucket S3 (ex.: `us-east-1`)                            | Sim         |
| `AWS_S3_ACCESS_KEY_ID`     | Access key da IAM com permissão de upload                         | Sim         |
| `AWS_S3_SECRET_ACCESS_KEY` | Secret key correspondente                                         | Sim         |
| `AWS_S3_BUCKET`            | Nome do bucket onde as imagens são armazenadas                    | Sim         |
| `AWS_S3_BASE_URL`          | URL pública base do bucket (ex.: `https://pi-learny.s3.us-east-1.amazonaws.com`) | Sim |

Exemplo de `.env`:

```env
API_URL=https://learny-mobile-api.onrender.com
JWT_SECRET=troque-este-valor-em-producao
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=AKIA...
AWS_S3_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=pi-learny
AWS_S3_BASE_URL=https://pi-learny.s3.us-east-1.amazonaws.com
```

## Scripts

```bash
npm run dev              # Servidor de desenvolvimento (porta 3000)
npm run build            # Build de produção
npm start                # Roda a build de produção
npm run lint             # ESLint
npm test                 # Vitest (one-shot)
npm run test:watch       # Vitest em watch mode
npm run test:coverage    # Vitest com relatório de cobertura
```

## Estrutura do projeto

```
dashboard-learny/
├── src/
│   ├── app/                  # App Router (Next.js)
│   │   ├── api/              # API routes (proxy para a API Flask + upload S3)
│   │   ├── cadastro/         # Página de cadastro de responsável
│   │   ├── configuracoes/    # Configurações da conta
│   │   ├── crianca/          # Páginas relacionadas à criança selecionada
│   │   ├── dashboard/        # Painel principal com gráficos de atividade
│   │   ├── excluir-conta-crianca/
│   │   ├── feedback/         # Envio de feedback
│   │   ├── home/             # Home (pós-login)
│   │   ├── perfil/           # Perfil do responsável
│   │   ├── layout.tsx        # Layout raiz (UserProvider, AlertProvider)
│   │   └── page.tsx          # Login (rota /)
│   ├── components/           # Componentes reutilizáveis (MUI + customizados)
│   ├── contexts/             # UserContext, AlertContext
│   ├── hooks/                # useApi, useGetData
│   ├── lib/                  # serverFetch (helper de API com Bearer token)
│   ├── middleware.ts         # Guarda de rotas protegidas (JWT em cookie)
│   ├── types/                # Tipagens compartilhadas
│   └── utils/                # activityCharts (transforma dados para gráficos)
├── public/                   # Assets estáticos
├── .github/workflows/ci.yml  # Pipeline CI/CD
├── vitest.config.ts          # Configuração do Vitest
├── eslint.config.mjs         # ESLint flat config
├── next.config.ts            # Configuração do Next.js
├── tsconfig.json
├── package.json
└── README.md
```

## Páginas

| Rota                       | Descrição                                              | Protegida |
|----------------------------|--------------------------------------------------------|-----------|
| `/`                        | Login (redireciona para `/dashboard` se autenticado)   | Não       |
| `/cadastro`                | Cadastro de responsável                                | Não       |
| `/home`                    | Home pós-login com banners                             | Sim       |
| `/dashboard`               | Painel com gráficos de atividade do filho selecionado  | Sim       |
| `/perfil`                  | Perfil do responsável (edição de dados)                | Sim       |
| `/configuracoes`           | Configurações da conta                                 | Sim       |
| `/feedback`                | Envio de feedback                                      | Sim       |
| `/crianca`                 | Páginas relacionadas à criança                         | Parcial   |
| `/excluir-conta-crianca`   | Confirmação de exclusão de conta de filho              | Parcial   |

A proteção é feita em `src/middleware.ts` — rotas protegidas redirecionam para `/` quando não há cookie `token` válido.

## API routes (proxy para a API Flask)

Todas as rotas em `/api/*` fazem proxy autenticado para a `learny-mobile-api`, repassando o JWT armazenado em cookie HTTP-only via `serverFetch`.

| Método | Rota                                                  | Encaminha para                                        |
|--------|-------------------------------------------------------|-------------------------------------------------------|
| POST   | `/api/login`                                          | `POST /auth/login` (seta o cookie `token`)            |
| POST   | `/api/logout`                                         | Remove o cookie `token`                               |
| GET    | `/api/parents`                                        | `GET /parents`                                        |
| PUT    | `/api/parents`                                        | `PUT /parents`                                        |
| DELETE | `/api/parents`                                        | `DELETE /parents`                                     |
| GET    | `/api/parents/children`                               | `GET /parents/children`                               |
| POST   | `/api/parents/children`                               | `POST /parents/children`                              |
| GET    | `/api/parents/child/selected`                         | `GET /parents/child/selected`                         |
| GET    | `/api/parents/child/[id]`                             | `GET /parents/children/[id]`                          |
| PUT    | `/api/parents/child/[id]`                             | `PUT /parents/children/[id]`                          |
| DELETE | `/api/parents/child/[id]`                             | `DELETE /parents/children/[id]`                       |
| PUT    | `/api/parents/child/[id]/status`                      | `PUT /parents/children/[id]/status`                   |
| GET    | `/api/parents/child/[id]/activity`                    | `GET /parents/child/[id]/activity`                    |
| POST   | `/api/parents/child/[id]/notifications`               | `POST /parents/child/[id]/notifications`              |
| GET    | `/api/game/characters`                                | `GET /game/characters`                                |
| POST   | `/api/upload`                                         | Upload direto para o bucket S3 configurado            |

## Testes

A suíte usa **Vitest** com ambiente `node` (sem JSDOM por enquanto, dado que só há utilitários puros).

```bash
npm test                 # Roda todos os testes uma vez
npm run test:watch       # Modo watch
npm run test:coverage    # Cobertura (provider: v8)
```

Os testes ficam colocalizados ao código (`src/**/*.test.ts`). Cobertura atual: 6 testes em `src/utils/activityCharts.ts` (lógica pura de agregação de atividades para os gráficos).

## CI/CD

O pipeline (`.github/workflows/ci.yml`) executa em todo push e pull request para `main` e `develop`:

1. **Lint**: `npm run lint` (ESLint flat config)
2. **Type check**: `npx tsc --noEmit` (TypeScript strict)
3. **Testes**: `npm test` (Vitest)
4. **Build**: `npm run build` (Next.js de produção)

O CI atua apenas como **gate de qualidade**. O deploy é feito automaticamente pela **Vercel** via integração nativa com o GitHub:

- **Previews**: cada PR ganha uma URL de preview única
- **Produção**: cada merge em `main` dispara um deploy de produção

### Variáveis de ambiente em produção

As mesmas variáveis listadas acima devem ser configuradas em:
- **Vercel**: Project Settings → Environment Variables
- Recomenda-se separar entre os escopos `Production`, `Preview` e `Development`.

## Convenções

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `ci:`, `test:`, `refactor:`, ...).
- **Branches**: `main` (produção), `develop` (integração), feature branches a partir de `develop`.
- **Tipagem**: TypeScript strict habilitado; o build da Vercel falha em qualquer erro de tipo desde que `typescript.ignoreBuildErrors` foi removido do `next.config.ts`.
- **Estilo**: ESLint (`next/core-web-vitals` + `next/typescript`); rodar `npm run lint` antes de abrir PR.
