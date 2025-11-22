# **Daily Diet – Product Requirements Document (PRD) Completo**

## **1. Visão Geral**
O *Daily Diet* é um sistema de controle nutricional no qual usuários registram refeições e acompanham seu progresso em relação à dieta. Este PRD consolida todos os requisitos funcionais, técnicos, arquiteturais e complementares para o backend.

---

## **2. Objetivos do Produto**
- Permitir registrar refeições.
- Identificar usuários individualmente.
- Gerar métricas alimentares.
- Integrar ao app mobile conforme telas do Figma.

---

## **3. Público-Alvo**
- Usuários interessados em controle alimentar.
- Estudantes desenvolvendo APIs.
- Participantes do desafio Ignite Node.js.

---

## **4. Requisitos Funcionais**
### **FR-001 — Criar Usuário**
- `name`, `email`, `id`, `created_at`.
- Email deve ser único.

### **FR-002 — Identificar Usuário**
- Identificação obrigatória via header `user-id`.
- Não há suporte a token de autenticação.
- Todas as rotas de refeição e métricas exigem identificação.

### **FR-003 — Criar Refeição**
- `name`, `description`, `datetime`, `is_on_diet`, `user_id`.

### **FR-004 — Editar Refeição**
- Alterar todos os dados.
- Validar que pertence ao usuário.

### **FR-005 — Excluir Refeição**

### **FR-006 — Listar Refeições**

### **FR-007 — Visualizar Refeição**

### **FR-008 — Métricas**
- total de refeições  
- total dentro da dieta  
- total fora da dieta  
- melhor sequência dentro da dieta  

---

## **5. Regras de Negócio**
- Refeições devem pertencer a um usuário.
- Um usuário só pode acessar seus próprios dados.
- Métrica de sequência considera apenas refeições consecutivas com `is_on_diet = true`.

---

## **6. Requisitos Não Funcionais**
- API REST padronizada.
- Respostas em <200ms.
- Persistência via SQLite/Prisma.
- Segurança mínima: cada usuário acessa apenas seu próprio conteúdo.

---

## **7. Modelagem de Dados**

### **Tabela users**
| Campo | Tipo |
|-------|------|
| id | uuid |
| name | string |
| email | string |
| created_at | datetime |

### **Tabela meals**
| Campo | Tipo |
|-------|------|
| id | uuid |
| user_id | uuid |
| name | string |
| description | string |
| datetime | datetime |
| is_on_diet | boolean |
| created_at | datetime |

---

## **8. Endpoints**

### **Usuários**
```
POST /users
GET /users/:id
```

### **Refeições**
```
POST /meals
GET /meals
GET /meals/:id
PUT /meals/:id
DELETE /meals/:id
```

### **Métricas**
```
GET /metrics
```

---

# **Complementar: Arquitetura**

## **Arquitetura Proposta (Node.js + Fastify + Prisma + SQLite)**

### **Camadas**
- **Routes** → Recebem requisições HTTP.
- **Controllers** → Validam/formatam entrada e saída.
- **Services** → Regras de negócio.
- **Repositories** → Prisma ORM.
- **Database** → SQLite.

### **Vantagens**
- Baixa complexidade.
- Performance boa via Fastify.
- Facilita testes unitários.
- Prisma para migrações e schema tipado.

### **Estrutura de Pastas**
```
src/
 ├─ modules/
 │   ├─ users/
 │   │   ├─ controller.ts
 │   │   ├─ service.ts
 │   │   └─ repository.ts
 │   ├─ meals/
 │   │   ├─ controller.ts
 │   │   ├─ service.ts
 │   │   └─ repository.ts
 ├─ middlewares/
 ├─ database/
 ├─ server.ts
```

---

# **Complementar: Especificação OpenAPI (Swagger)**

```
openapi: 3.0.0
info:
  title: Daily Diet API
  version: 1.0.0

paths:
  /users:
    post:
      summary: Cria um usuário
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
      responses:
        201:
          description: Usuário criado

  /meals:
    get:
      summary: Lista refeições do usuário
      parameters:
        - name: user-id
          in: header
          required: true
          schema:
            type: string
    post:
      summary: Cria uma refeição
      parameters:
        - name: user-id
          in: header
          required: true
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Meal'

  /meals/{id}:
    get:
      summary: Retorna uma refeição
    put:
      summary: Edita refeição
    delete:
      summary: Deleta refeição

  /metrics:
    get:
      summary: Retorna métricas do usuário

components:
  schemas:
    Meal:
      type: object
      properties:
        name: { type: string }
        description: { type: string }
        datetime: { type: string }
        is_on_diet: { type: boolean }
```

---

# **Complementar: Checklist de Implementação**

### **Usuários**
- [ ] Rota POST /users
- [ ] Validação de email único
- [ ] Middleware de identificação do usuário

### **Refeições**
- [ ] CRUD completo
- [ ] Validação de data e hora
- [ ] Garantir domínio do usuário sobre refeição
- [ ] Ordenar refeições por data/hora

### **Métricas**
- [ ] Total de refeições
- [ ] Dentro da dieta
- [ ] Fora da dieta
- [ ] Melhor sequência (algoritmo)

---

# **Complementar: Código Base (Fastify + Prisma)**

### **server.ts**
```ts
import Fastify from 'fastify';
import { usersRoutes } from './modules/users/users.routes';
import { mealsRoutes } from './modules/meals/meals.routes';

const app = Fastify();

app.register(usersRoutes, { prefix: '/users' });
app.register(mealsRoutes, { prefix: '/meals' });

app.listen({ port: 3333 });
```

### **Middleware de Identificação**
```ts
export async function ensureUser(request, reply) {
  const userId = request.headers['user-id'];
  if (!userId) return reply.status(401).send({ error: "User not identified" });
  request.userId = userId;
}
```

---

# **Conclusão**
Este documento consolida PRD, regras de negócio, arquitetura, endpoints, modelos de dados, OpenAPI, checklist e exemplos de código — servindo como base completa para o desenvolvimento do backend do Daily Diet.

