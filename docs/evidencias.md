# Evidências de Execução — Bugs e Falhas

Evidências dos cenários que falharam durante a execução, relacionados aos bugs documentados em [`bugs.md`](bugs.md).

## Nota sobre o escopo deste documento

O checklist pede um "documento com as evidências da execução", sem especificar se isso significa evidenciar **todos** os cenários ou só os relevantes. Interpretei que o valor de uma evidência está em **comprovar um problema ou uma decisão**, não em repetir visualmente os 44 cenários que já têm resultado documentado em `execucao-testes.md`.

Por isso, optei por registrar evidência (print de tela / request-response) apenas dos cenários que **falharam** — todos ligados aos 3 bugs reportados. Os cenários que passaram já têm o resultado confirmado na tabela de execução; duplicar print de cada um geraria volume de documento sem agregar informação nova.

---

## BUG-01 — API não aplica o limite de 5 unidades por produto

Falhou em dois pontos: no cálculo do carrinho (`API-CALC-05`, exemplo "quantidade acima de 5") e na confirmação do pedido (`EXP-02`, achado exploratório) — confirmando que o problema não é exclusivo de um endpoint.

### Cálculo do carrinho — quantidade 6

**Requisição:**

```http
POST /api/carrinho/calcular
Content-Type: application/json

{ "itens": [{ "produtoId": "P001", "quantidade": 6 }] }
```

**Esperado:** `422` com `codigo: "QUANTIDADE_MAXIMA_EXCEDIDA"`

**Obtido:**

```json
HTTP 200
{
  "itens": [
    { "produtoId": "P001", "nome": "Camiseta Essencial", "precoUnitario": 59.9, "quantidade": 6, "total": 359.4 }
  ],
  "subtotal": 359.4,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 359.4,
  "cupom": null
}
```

![BUG-01](evidence/BUG-01-api.png)

### Confirmação de pedido — quantidade 10 (achado exploratório)

**Requisição:**

```http
POST /api/pedidos
Content-Type: application/json

{
  "cliente": { "nome": "Breno Pablo", "email": "breno@exemplo.com", "cep": "01310-100" },
  "itens": [{ "produtoId": "P005", "quantidade": 10 }]
}
```

**Esperado:** `422` com `codigo: "QUANTIDADE_MAXIMA_EXCEDIDA"`, pedido não criado

**Obtido:**

```json
HTTP 201
{
  "numero": "VZ-387137",
  "criadoEm": "2026-10-06T18:02:44.540Z",
  "cliente": { "nome": "Breno Pablo", "email": "breno@exemplo.com", "cep": "01310100" },
  "itens": [
    { "produtoId": "P005", "nome": "Mochila Urbana 20L", "precoUnitario": 100, "quantidade": 10, "total": 1000 }
  ],
  "subtotal": 1000,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 1000,
  "cupom": null
}
```

Pedido criado com sucesso mesmo excedendo o limite de 5 unidades por produto.

---

## BUG-02 — Código de erro incorreto quando falta o campo `quantidade`

**Requisição:**

```http
POST /api/carrinho/calcular
Content-Type: application/json

{ "itens": [{ "produtoId": "P001" }] }
```

**Esperado:** `422` com `codigo: "ITEM_INVALIDO"`

**Obtido:**

```json
HTTP 422
{
  "erro": {
    "codigo": "QUANTIDADE_INVALIDA",
    "mensagem": "A quantidade deve ser um número inteiro maior ou igual a 1.",
    "campo": "itens[0].quantidade"
  }
}
```

![BUG-02](evidence/BUG-02-api.png)

---

## BUG-03 — Frete não fica grátis no limite exato de R$ 200,00

Encontrado ao escrever a automação com Playwright (cenários `CUPOM-07b` e `API-CALC-08`), testando o valor de fronteira exato que a execução manual original não tinha coberto.

### Evidência na interface

Carrinho com subtotal de exatamente R$ 200,00 (2x "Mochila Urbana 20L"): o frete continua cobrado (R$ 19,90) e, ao mesmo tempo, a mensagem informa que faltam R$ 0,00 para o frete grátis — as duas informações se contradizem na mesma tela.

![BUG-03](evidence/BUG-03-ui.png)

### Evidência na API

**Requisição:**

```http
POST /api/carrinho/calcular
Content-Type: application/json

{ "itens": [{ "produtoId": "P005", "quantidade": 2 }] }
```

**Esperado:** `freteGratis: true` e `frete: 0` (CA06 — "a partir de R$200,00, inclusive")

**Obtido:**

```json
HTTP 200
{
  "itens": [
    { "produtoId": "P005", "nome": "Mochila Urbana 20L", "precoUnitario": 100, "quantidade": 2, "total": 200 }
  ],
  "subtotal": 200,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 219.9,
  "cupom": null
}
```

Note a contradição entre `freteGratis: false` e `valorFaltanteFreteGratis: 0` na mesma resposta.
