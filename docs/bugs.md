# Bugs Encontrados — Verzel Store

Bugs identificados durante a execução dos cenários de teste (`docs/execucao-testes.md`), na funcionalidade de cupom de desconto e frete grátis.

**Resumo:** 3 bugs — 2 de severidade alta, 1 de severidade baixa.

---

## BUG-01 — API não aplica o limite de 5 unidades por produto

| Campo                     | Detalhe                                             |
| ------------------------- | --------------------------------------------------- |
| **Severidade**            | 🔴 Alta                                             |
| **Endpoints afetados**    | `POST /api/carrinho/calcular` e `POST /api/pedidos` |
| **Cenários relacionados** | API-CALC-05, EXP-02                                 |

### Descrição

A documentação define na CA10 que _"Cada produto pode ter no máximo 5 unidades por pedido. A regra vale para a interface e para a API."_ A interface (carrinho) respeita corretamente esse limite — testado e confirmado em CARR-03. Porém, **a API aceita qualquer quantidade**, sem validar o máximo de 5 unidades.

Isso permite contornar o limite da interface fazendo a chamada diretamente para a API.

### Passos para reproduzir

1. Enviar `POST /api/carrinho/calcular` com um item contendo `quantidade` maior que 5.
2. Observar que a resposta é `200 OK`, calculando o item normalmente — ao invés do erro esperado.
3. Repetir o mesmo teste em `POST /api/pedidos` — o pedido é confirmado com `201 Created`, criando um pedido com quantidade acima do limite.

### Requisição de exemplo

```http
POST /api/carrinho/calcular
Content-Type: application/json

{
  "itens": [
    { "produtoId": "P001", "quantidade": 10 }
  ]
}
```

### Resultado esperado

```json
HTTP 422
{
  "erro": {
    "codigo": "QUANTIDADE_MAXIMA_EXCEDIDA",
    "mensagem": "A quantidade de um produto é maior que 5.",
    "campo": "itens[0].quantidade"
  }
}
```

### Resultado obtido

```json
HTTP 200
{
  "itens": [
    { "produtoId": "P001", "nome": "Camiseta Essencial", "precoUnitario": 59.9, "quantidade": 10, "total": 599 }
  ],
  "subtotal": 599,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 599,
  "cupom": null
}
```

Em `POST /api/pedidos`, o mesmo teste (quantidade 10) retornou `201 Created` com um número de pedido válido (`VZ-387137`), confirmando que o bug também afeta a criação de pedidos, não só o cálculo.

### Impacto

Quebra uma regra de negócio documentada e testável tanto via interface quanto via API. Como a validação só existe no front-end, qualquer cliente de API (ou um usuário mal-intencionado via requisição direta) pode criar pedidos fora da regra combinada de negócio.

---

## BUG-02 — Código de erro incorreto quando o item não tem o campo `quantidade`

| Campo                   | Detalhe                       |
| ----------------------- | ----------------------------- |
| **Severidade**          | 🟡 Baixa                      |
| **Endpoint afetado**    | `POST /api/carrinho/calcular` |
| **Cenário relacionado** | API-CALC-05                   |

### Descrição

A documentação especifica dois códigos de erro distintos para problemas em itens do carrinho:

- `ITEM_INVALIDO` — _"Um item não é um objeto com produto Id e quantidade."_
- `QUANTIDADE_INVALIDA` — _"A quantidade não é um número inteiro maior ou igual a 1."_

Ao enviar um item **sem o campo `quantidade`** (campo ausente, não apenas inválido), a API retorna `QUANTIDADE_INVALIDA` em vez do `ITEM_INVALIDO` esperado pela especificação.

### Passos para reproduzir

1. Enviar `POST /api/carrinho/calcular` com um item contendo apenas `produtoId`, sem a chave `quantidade`.

### Requisição de exemplo

```http
POST /api/carrinho/calcular
Content-Type: application/json

{
  "itens": [
    { "produtoId": "P001" }
  ]
}
```

### Resultado esperado

```json
HTTP 422
{
  "erro": {
    "codigo": "ITEM_INVALIDO",
    "mensagem": "...",
    "campo": "itens[0]"
  }
}
```

### Resultado obtido

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

### Impacto

Baixo — a API ainda retorna `422` com uma mensagem compreensível, então o comportamento funcional não está quebrado. No entanto, uma integração que trate erros pelo campo `codigo` (em vez de só exibir a `mensagem`) trataria esse caso incorretamente, já que o código não bate com o documentado.

---

## BUG-03 — Frete não fica grátis no limite exato de R$ 200,00

| Campo                        | Detalhe                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Severidade**               | 🔴 Alta                                                                                                                |
| **Endpoints/telas afetados** | `POST /api/carrinho/calcular` e carrinho (UI)                                                                          |
| **Encontrado em**            | Automação Playwright (`tests/ui/cupom-frete.spec.ts` — CUPOM-07b, `tests/api/carrinho-calcular.spec.ts` — API-CALC-08) |

### Descrição

A CA06 afirma: _"O frete é grátis para compras com subtotal a partir de R$ 200,00, **inclusive**."_ A palavra "inclusive" deixa claro que o valor exato de R$ 200,00 deveria qualificar para frete grátis.

Na prática, com subtotal de **exatamente R$ 200,00**, o frete continua sendo cobrado (`R$ 19,90`). Curiosamente, a API retorna `valorFaltanteFreteGratis: 0` ao mesmo tempo que `freteGratis: false` — os dois campos se contradizem: um diz que não falta nada para o frete grátis, o outro diz que o frete não é grátis.

Reforçando o valor de ter casos de teste no limite exato das regras de negócio, não só acima/abaixo dela.

### Passos para reproduzir

1. Montar um carrinho cujo subtotal some exatamente R$ 200,00 (ex: 2x "Mochila Urbana 20L", R$ 100,00 cada).
2. Consultar o resumo do pedido (UI) ou calcular via API.

### Requisição de exemplo

```http
POST /api/carrinho/calcular
Content-Type: application/json

{ "itens": [{ "produtoId": "P005", "quantidade": 2 }] }
```

### Resultado esperado

```json
{
  "subtotal": 200,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0
}
```

### Resultado obtido

```json
{
  "subtotal": 200,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 219.9,
  "cupom": null
}
```

### Impacto

Alto — contraria diretamente uma regra de negócio documentada ("inclusive") e os próprios campos da resposta se contradizem entre si, o que pode confundir tanto o cliente final (vê "falta R$0,00" mas ainda paga frete) quanto qualquer integração que confie em `valorFaltanteFreteGratis` para decidir se o frete é gratuito.

---
