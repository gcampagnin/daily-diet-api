# Daily Diet API

API REST construída com Node.js, Fastify e Prisma para registrar refeições diárias, identificar usuários pelo header `user-id` e calcular métricas de aderência à dieta. O projeto foi desenvolvido durante o desafio Ignite Node.js da Rocketseat e serve como backend para aplicativos mobile/web do Daily Diet.

## Funcionalidades
- Cadastro e consulta de usuários com validação de e-mail único.
- Autenticação simplificada via header `user-id` para todas as rotas de refeições e métricas.
- CRUD completo de refeições com associação obrigatória ao usuário e validações com Zod.
- Geração de métricas: total de refeições, refeições dentro/fora da dieta e melhor sequência dentro da dieta.
- Estrutura em camadas (Routes → Controllers → Services → Repositories) e acesso ao banco por Prisma/SQLite.

## Stack
- Node.js 20+
- Fastify 5
- TypeScript
- Prisma ORM + SQLite
- Zod para validações
- dotenv, @fastify/cors

## Como começar
1. **Instale as dependências**
   ```bash
   npm install
   ```
2. **Configure o ambiente**
   Copie o arquivo de exemplo e ajuste se necessário:
   ```bash
   cp .env.example .env
   ```
   O valor padrão (`file:./tmp/daily-diet.db`) cria o banco SQLite em `tmp/`.
3. **Execute as migrations**
   ```bash
   npm run prisma:migrate
   ```
4. **Suba o servidor em modo desenvolvimento**
   ```bash
   npm run dev
   ```
   O Fastify iniciará em `http://localhost:3333`. Para ambiente produtivo utilize `npm run build` seguido de `npm start`.

### Scripts úteis
| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com `tsx watch`. |
| `npm run build` | Gera o código JavaScript em `dist/` via TypeScript. |
| `npm start` | Executa a versão compilada (`dist/server.js`). |
| `npm run prisma:migrate` | Executa `prisma migrate dev`. |
| `npm run prisma:generate` | Regenera o Prisma Client. |
| `npm run lint` | Checa tipos sem emitir arquivos. |

## Banco de dados
- **Prisma Schema:** `prisma/schema.prisma` com os modelos `User` e `Meal`.
- **SQLite:** recomendado apenas para desenvolvimento/local; ajuste `DATABASE_URL` para Postgres/MySQL se necessário.
- **Migrations:** ficam em `prisma/migrations/`. Sempre rode as migrations antes de subir a aplicação.

## Identificação do usuário
As rotas de refeições e métricas usam o middleware `ensureUser` (`src/middlewares/ensure-user.ts`) que exige o header `user-id`. Esse valor precisa ser o `id` retornado pelo cadastro do usuário (rota `POST /users`). Requisições sem o header ou com usuário inexistente recebem `401/404`.

## Endpoints

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| `POST` | `/users` | Cria um usuário. | — |
| `GET` | `/users/:id` | Busca usuário pelo `id`. | — |
| `POST` | `/meals` | Registra uma refeição. | Header `user-id` |
| `GET` | `/meals` | Lista todas as refeições do usuário. | Header `user-id` |
| `GET` | `/meals/:id` | Detalha uma refeição específica. | Header `user-id` |
| `PUT` | `/meals/:id` | Atualiza uma refeição do usuário. | Header `user-id` |
| `DELETE` | `/meals/:id` | Remove uma refeição. | Header `user-id` |
| `GET` | `/metrics` | Retorna métricas alimentares. | Header `user-id` |

### Exemplos
#### Criar usuário
```http
POST /users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```
Resposta:
```json
{
  "user": {
    "id": "cd2d395f-98fc-4a3d-a9fb-d6dae84acfce",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "created_at": "2025-01-01T08:00:00.000Z"
  }
}
```

#### Criar refeição
```http
POST /meals
Content-Type: application/json
user-id: cd2d395f-98fc-4a3d-a9fb-d6dae84acfce

{
  "name": "Breakfast",
  "description": "Greek yogurt with fruits",
  "datetime": "2025-01-01T08:00:00.000Z",
  "is_on_diet": true
}
```

#### Métricas
```http
GET /metrics
user-id: cd2d395f-98fc-4a3d-a9fb-d6dae84acfce
```
Resposta:
```json
{
  "metrics": {
    "total_meals": 8,
    "meals_inside_diet": 6,
    "meals_outside_diet": 2,
    "best_on_diet_sequence": 4
  }
}
```

## Ferramentas auxiliares
- **`client.http`:** arquivo com uma coleção de requisições REST Client (VS Code) cobrindo o fluxo completo: cadastro de usuário, CRUD de refeições e métricas. Atualize o `{{baseUrl}}` conforme necessário.
- **`daily-diet-prd.md`:** documento com PRD completo, requisitos de negócio e especificação OpenAPI.

## Estrutura de pastas
```
src
├─ modules
│  ├─ users (routes, controller, service e repository)
│  └─ meals  (inclui métricas)
├─ middlewares (ensure-user)
├─ errors (AppError)
├─ utils (serializers)
└─ lib (instância Prisma)
```

---

Feito com ❤️ durante o Ignite Node.js — Daily Diet.
