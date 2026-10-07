# Execução dos Testes — Verzel Store

Execução manual (UI e API) e exploratória dos cenários definidos em `/features`, baseados na documentação da Verzel Store.

**Resultado geral:** 39/43 cenários passaram · 4 falharam · 2 achados em teste exploratório · [3 bugs reportados](bugs.md)

---

## Resumo por arquivo

| Arquivo                         | Cenários | Passou | Falhou |
| ------------------------------- | -------- | ------ | ------ |
| `ui/carrinho.feature`           | 9        | 9      | 0      |
| `ui/cupom-frete.feature`        | 12       | 11     | 1      |
| `ui/pedidos.feature`            | 7        | 7      | 0      |
| `api/produtos.feature`          | 3        | 3      | 0      |
| `api/carrinho-calcular.feature` | 8        | 5      | 3      |
| `api/confirmar-pedido.feature`  | 5        | 5      | 0      |
| **Total**                       | **43**   | **39** | **4**  |

---

## Carrinho (UI)

| ID      | Cenário                             | Resultado | Observação                                          |
| ------- | ----------------------------------- | --------- | --------------------------------------------------- |
| CARR-01 | Adicionar produto ao carrinho       | ✅ Passou |                                                     |
| CARR-02 | Aumentar quantidade                 | ✅ Passou |                                                     |
| CARR-03 | Não permitir mais de 5 unidades     | ✅ Passou | Mensagem exata: "Limite de 5 unidades por produto." |
| CARR-04 | Remover produto do carrinho         | ✅ Passou |                                                     |
| CARR-05 | Esvaziar carrinho                   | ✅ Passou |                                                     |
| CARR-06 | Não permitir quantidade menor que 1 | ✅ Passou |                                                     |
| CARR-07 | Somar quantidade ao repetir produto | ✅ Passou |                                                     |
| CARR-08 | Carrinho vazio exibe estado vazio   | ✅ Passou |                                                     |
| CARR-09 | Bloquear pedidos com carrinho vazio | ✅ Passou |                                                     |

## Cupom-frete (UI)

| ID        | Cenário                                           | Resultado | Observação                                                                                                                                                                                                         |
| --------- | ------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CUPOM-01  | Aplicar cupom válido                              | ✅ Passou |                                                                                                                                                                                                                    |
| CUPOM-02  | Cupom case-insensitive / trim de espaços          | ✅ Passou |                                                                                                                                                                                                                    |
| CUPOM-03  | Cupom inexistente                                 | ✅ Passou |                                                                                                                                                                                                                    |
| CUPOM-04  | Cupom expirado                                    | ✅ Passou |                                                                                                                                                                                                                    |
| CUPOM-05  | Tentar aplicar cupom vazio                        | ✅ Passou |                                                                                                                                                                                                                    |
| CUPOM-06  | Remover cupom libera campo para nova tentativa    | ✅ Passou | Cenário reescrito — só existe 1 cupom válido nos dados de teste, não dá pra "trocar por outro válido"                                                                                                              |
| CUPOM-07  | Frete grátis para subtotal acima de R$ 200,00     | ✅ Passou | Testado com R$ 239,80 (acima do limite). Para o valor exato de R$ 200,00, ver CUPOM-07b abaixo.                                                                                                                    |
| CUPOM-07b | Frete grátis no limite exato de R$ 200,00         | ❌ Falhou | A CA06 diz "a partir de R$200,00, inclusive", mas no valor exato o frete continua sendo cobrado → [BUG-03](bugs.md#bug-03)                                                                                         |
| CUPOM-08  | Frete fixo abaixo de R$ 200,00                    | ✅ Passou |                                                                                                                                                                                                                    |
| CUPOM-09  | Valor faltante para o frete grátis (esquema)      | ✅ Passou | A linha "R$200,00 → R$0,00" está correta — o valor da mensagem bate com o cálculo. Mas atenção: nesse mesmo valor, o frete não fica grátis de fato — ver [BUG-03](bugs.md#bug-03), capturado no cenário CUPOM-07b. |
| CUPOM-10  | Frete grátis considera subtotal antes do desconto | ✅ Passou | Testado com R$ 239,80 (acima do limite), pelo mesmo motivo do CUPOM-07                                                                                                                                             |
| CUPOM-11  | Desconto do cupom não incide sobre o frete        | ✅ Passou |                                                                                                                                                                                                                    |

## Pedidos (UI)

| ID     | Cenário                                      | Resultado | Observação          |
| ------ | -------------------------------------------- | --------- | ------------------- |
| PED-01 | Confirmar pedido com dados válidos           | ✅ Passou |                     |
| PED-02 | Submeter formulário vazio                    | ✅ Passou |                     |
| PED-03 | Nome sem sobrenome                           | ✅ Passou |                     |
| PED-04 | E-mail em formato inválido                   | ✅ Passou |                     |
| PED-05 | CEP com menos de 8 dígitos                   | ✅ Passou |                     |
| PED-06 | CEP aceita com ou sem hífen (esquema)        | ✅ Passou | 2 exemplos testados |
| PED-07 | Carrinho é esvaziado após confirmar o pedido | ✅ Passou |                     |

## Produtos (API)

| ID          | Cenário                             | Resultado | Observação                   |
| ----------- | ----------------------------------- | --------- | ---------------------------- |
| API-PROD-01 | Listar todos os produtos            | ✅ Passou |                              |
| API-PROD-02 | Consultar produto existente pelo id | ✅ Passou |                              |
| API-PROD-03 | Consultar produto inexistente       | ✅ Passou | 404 / PRODUTO_NAO_ENCONTRADO |

## Carrinho-calcular (API)

| ID          | Cenário                                   | Resultado        | Observação                                                                                                                                                                                                   |
| ----------- | ----------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API-CALC-01 | Calcular carrinho sem cupom               | ✅ Passou        |                                                                                                                                                                                                              |
| API-CALC-02 | Calcular carrinho com cupom válido        | ✅ Passou        |                                                                                                                                                                                                              |
| API-CALC-03 | Cupom inválido não gera erro              | ✅ Passou        | 200, `cupom.aplicado: false`                                                                                                                                                                                 |
| API-CALC-04 | Cupom expirado não gera erro              | ✅ Passou        | 200, `cupom.aplicado: false`                                                                                                                                                                                 |
| API-CALC-05 | Códigos de erro (esquema — 7 exemplos)    | ⚠️ Parcial (5/7) | "item sem quantidade" retornou `QUANTIDADE_INVALIDA` em vez de `ITEM_INVALIDO` → [BUG-02](bugs.md#bug-02); "quantidade 6" retornou 200 em vez de 422 `QUANTIDADE_MAXIMA_EXCEDIDA` → [BUG-01](bugs.md#bug-01) |
| API-CALC-06 | Rota inexistente                          | ✅ Passou        | 404 / ROTA_NAO_ENCONTRADA                                                                                                                                                                                    |
| API-CALC-07 | Método HTTP não permitido                 | ✅ Passou        | 405 / METODO_NAO_PERMITIDO                                                                                                                                                                                   |
| API-CALC-08 | Frete grátis no limite exato de R$ 200,00 | ❌ Falhou        | `freteGratis: false` e `frete: 19.9`, mas `valorFaltanteFreteGratis: 0` ao mesmo tempo — campos contraditórios → [BUG-03](bugs.md#bug-03)                                                                    |

## Confirmar-pedido (API)

| ID         | Cenário                                               | Resultado | Observação                                                             |
| ---------- | ----------------------------------------------------- | --------- | ---------------------------------------------------------------------- |
| API-PED-01 | Confirmar pedido com dados válidos                    | ✅ Passou |                                                                        |
| API-PED-02 | Pedido com cupom inválido                             | ✅ Passou | 422 / CUPOM_INVALIDO                                                   |
| API-PED-03 | Pedido com cupom expirado                             | ✅ Passou | 422 / CUPOM_EXPIRADO                                                   |
| API-PED-04 | Validação dos dados do cliente (esquema — 3 exemplos) | ✅ Passou | nome, email e cep testados                                             |
| API-PED-05 | Pedido reflete o mesmo cálculo do carrinho            | ✅ Passou | subtotal/desconto/frete/total idênticos entre `/calcular` e `/pedidos` |

## Exploratório

| ID     | O que foi testado                                   | Resultado | Observação                                                                   |
| ------ | --------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| EXP-01 | Quantidade negativa e decimal via API               | ✅ Passou | Corretamente rejeitadas com QUANTIDADE_INVALIDA                              |
| EXP-02 | Limite de 5 unidades também falha em `/api/pedidos` | ❌ Falhou | Reforça o [BUG-01](bugs.md#bug-01) — não é exclusivo do `/carrinho/calcular` |

---
