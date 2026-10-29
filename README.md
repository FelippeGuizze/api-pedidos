# API de Gerenciamento de Pedidos

API REST em Node.js e Express para gerenciar pedidos de uma pequena loja. Armazenamento em memória.

## Instalação e execução

```bash
npm install
npm start
```

O servidor sobe em `http://localhost:3000` (porta alterável pela variável `PORT`).

## Testes

```bash
npm test
```

## Arquitetura

Arquitetura em camadas:

- `routes/` define as rotas e as liga aos controllers.
- `controllers/` recebe a requisição, chama o service e devolve a resposta HTTP (traduz erros em status).
- `services/` contém a regra de negócio e o armazenamento em memória.
- `handles/` contém as validações e as regras de transição de status.
- `tests/` contém os testes automatizados (Jest e Supertest).

## Valores aceitos

| Campo | Valores |
|---|---|
| tipo | `entrega`, `retirada`, `local` |
| prioridade | `baixa`, `normal`, `alta` |
| status | `recebido`, `em_preparacao`, `enviado`, `entregue`, `cancelado` |

Transições de status permitidas:

| De | Para |
|---|---|
| recebido | em_preparacao, cancelado |
| em_preparacao | enviado, cancelado |
| enviado | entregue, cancelado |
| entregue | (nenhuma) |
| cancelado | (nenhuma) |

## Rotas

| Método | Rota | Sucesso | Erros |
|---|---|---|---|
| POST | `/pedidos` | 201 | 400 |
| GET | `/pedidos` | 200 | |
| GET | `/pedidos/:id` | 200 | 404 |
| PATCH | `/pedidos/:id/status` | 200 | 400, 404 |

Erros inesperados retornam 500. Todo erro retorna JSON no formato `{ "erro": "mensagem" }`.

### Exemplo: criar pedido

`POST /pedidos`

```json
{
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal"
}
```

Resposta `201`:

```json
{
  "id": 1,
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal",
  "status": "recebido"
}
```

### Exemplo: atualizar status

`PATCH /pedidos/1/status`

```json
{ "status": "em_preparacao" }
```

## Validações

- `cliente`: texto não vazio (espaços nas pontas são removidos).
- `valor`: número maior que zero.
- `tipo` e `prioridade`: valores da tabela acima.
- Transição de status fora da tabela retorna 400.
