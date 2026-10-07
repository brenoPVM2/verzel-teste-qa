# Verzel Store — Teste Técnico de QA

Processo seletivo de QA Júnior da Verzel: cenários de teste, execução manual/exploratória, report de bugs, evidências e automação end-to-end (UI + API) sobre a aplicação [Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev).

![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?logo=playwright&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Gherkin](https://img.shields.io/badge/Gherkin-Cucumber-23D96C?logo=cucumber&logoColor=white) ![Node](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?logo=node.js&logoColor=white)

## 🚀 Sobre o projeto

A Verzel Store é um ambiente fictício de e-commerce usado como teste técnico. A entrega deste repositório cobre a funcionalidade de **cupom de desconto e frete grátis**, documentada em [`/documentacao`](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao), tanto pela **interface** (carrinho, cupom, checkout) quanto pela **API REST** (`/api/produtos`, `/api/carrinho/calcular`, `/api/pedidos`).

O que foi entregue, conforme o checklist do teste técnico:

- [x] Cenários de teste levantados a partir da documentação, escritos em **Gherkin** → [`/features`](features)
- [x] Execução dos testes, manuais e exploratórios, com o resultado de cada cenário → [`docs/execucao-testes.md`](docs/execucao-testes.md)
- [x] Report de todos os bugs encontrados → [`docs/bugs.md`](docs/bugs.md)
- [x] Documento com as evidências da execução → [`docs/evidencias.md`](docs/evidencias.md)
- [x] Automação de pelo menos 3 cenários com **Playwright** → 55 testes em [`/tests`](tests) (cobrindo todos os 44 cenários documentados, não só os 3 mínimos)
- [x] README explicando como rodar a automação e onde encontrar cada entrega
- [x] Tudo em um único repositório público no GitHub

## ✅ Status do projeto

| Métrica | Valor |
|---|---|
| Cenários documentados (Gherkin) | 44 |
| Cenários executados manualmente | 44 (40 passaram, 4 falharam) |
| Bugs encontrados | 3 (2 de severidade alta, 1 baixa) |
| Testes automatizados (Playwright) | 55 — 100% passando |
| Cobertura | UI (carrinho, cupom/frete, checkout) + API (produtos, cálculo, pedidos) |

> **Por que 55 testes automatizados e não só 44?** Alguns cenários em Gherkin usam `Esquema do Cenário` (tabelas de exemplo), que a automação expande em um teste por linha. Além disso, 5 testes documentam os 3 bugs encontrados como falhas conhecidas (`test.fail()`) — eles "passam" por falharem exatamente como o esperado, e vão acusar erro automaticamente no dia em que o bug for corrigido.

## 🛠 Tecnologias utilizadas

- **[Playwright Test](https://playwright.dev/)** — automação de UI e de API no mesmo framework
- **TypeScript** — tipagem nos testes e Page Objects
- **Gherkin** — especificação dos cenários de teste (`/features`)
- **Node.js ≥ 18**

## 📂 Estrutura do projeto

```
verzel-teste-qa/
├── features/                    # cenários de teste em Gherkin (documentação)
│   ├── ui/
│   │   ├── carrinho.feature
│   │   ├── cupom-frete.feature
│   │   └── pedidos.feature
│   └── api/
│       ├── produtos.feature
│       ├── carrinho-calcular.feature
│       └── confirmar-pedido.feature
│
├── docs/                        # execução, bugs e evidências
│   ├── execucao-testes.md       # resultado de cada cenário
│   ├── bugs.md                  # report detalhado dos bugs
│   ├── evidencias.md            # prints e request/response dos bugs
│   └── evidence/                # imagens referenciadas no evidencias.md
│
├── pages/                       # Page Objects (Page Object Model)
│   ├── ProdutosPage.ts
│   ├── CarrinhoPage.ts
│   └── CheckoutPage.ts
│
├── tests/                       # automação Playwright
│   ├── ui/
│   │   ├── carrinho.spec.ts
│   │   ├── cupom-frete.spec.ts
│   │   └── checkout.spec.ts
│   └── api/
│       ├── produtos.spec.ts
│       ├── carrinho-calcular.spec.ts
│       └── confirmar-pedido.spec.ts
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🧭 Onde encontrar cada entrega

| Entrega do checklist | Local |
|---|---|
| Cenários de teste (Gherkin) | [`/features`](features) |
| Execução dos testes (manual + exploratória) | [`docs/execucao-testes.md`](docs/execucao-testes.md) |
| Report de bugs | [`docs/bugs.md`](docs/bugs.md) |
| Evidências da execução | [`docs/evidencias.md`](docs/evidencias.md) |
| Automação (Playwright) | [`/tests`](tests) |
| Como rodar a automação | seção [🤖 Rodando a automação](#-rodando-a-automação) abaixo |

## 🧪 Cenários de teste

Os cenários cobrem fluxos **básicos** (caminho feliz), **alternativos** (variações válidas) e de **exceção** (regras de negócio bloqueando ações indevidas), identificados por tags (`@CARR-01`, `@CUPOM-03`, `@basico`, `@excecao`, etc.) para rastreabilidade entre o `.feature`, a execução e a automação.

Fora de escopo, conforme a própria documentação da Verzel Store: login, cadastro de clientes, pagamento online e consulta de pedidos.

## 🐞 Bugs encontrados

| ID | Descrição | Severidade |
|---|---|---|
| [BUG-01](docs/bugs.md#bug-01) | API não aplica o limite de 5 unidades por produto (`/carrinho/calcular` e `/pedidos`) | 🔴 Alta |
| [BUG-02](docs/bugs.md#bug-02) | Código de erro incorreto (`QUANTIDADE_INVALIDA` em vez de `ITEM_INVALIDO`) quando falta o campo `quantidade` | 🟡 Baixa |
| [BUG-03](docs/bugs.md#bug-03) | Frete não fica grátis no limite exato de R$ 200,00, apesar da regra dizer "inclusive" | 🔴 Alta |

Detalhes completos, passos de reprodução e evidências em [`docs/bugs.md`](docs/bugs.md) e [`docs/evidencias.md`](docs/evidencias.md).

## 🤖 Rodando a automação

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18 ou superior
- Git

### Instalação
```bash
git clone https://github.com/brenoPVM2/verzel-teste-qa.git
cd verzel-teste-qa
npm install
npx playwright install chromium
```

### Scripts disponíveis
| Comando | O que faz |
|---|---|
| `npx playwright test` | Roda toda a suíte (UI + API) |
| `npx playwright test tests/ui` | Roda só os testes de UI |
| `npx playwright test tests/api` | Roda só os testes de API (não precisa de navegador) |
| `npx playwright test --headed` | Roda com o navegador visível |
| `npx playwright show-report` | Abre o relatório HTML da última execução |

> **Windows + PowerShell:** se aparecer um erro de política de execução de scripts ao rodar `npx`, use `npx.cmd` no lugar de `npx`, ou libere com `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## 🎯 Decisões técnicas e padrões aplicados

- **Page Object Model (POM):** seletores e ações de cada página encapsulados em `pages/`, evitando duplicação entre os testes.
- **Testes orientados a dados:** cenários com múltiplos exemplos (ex: validação de CEP, códigos de erro da API) viram um `for` gerando um teste por combinação, espelhando o `Esquema do Cenário` do Gherkin.
- **`expect.poll()` para estados assíncronos:** o resumo do carrinho (subtotal/desconto/frete) é recalculado de forma assíncrona após cada ação — leituras usam polling em vez de uma leitura única, evitando testes instáveis (flaky).
- **Bugs como testes, não como exceções silenciosas:** os 3 bugs encontrados viraram testes com `test.fail()`, afirmando o comportamento **correto** (da especificação) em vez do comportamento atual (com bug). Se o bug for corrigido, o teste acusa automaticamente.
- **Teste de valores de fronteira:** o BUG-03 só foi encontrado por testar o valor exato de R$ 200,00 (não só "acima" ou "abaixo" da regra) — reforça a importância de cobrir limites exatos, não só os dois lados deles.

## 🔮 Possíveis melhorias futuras

- Integração contínua via GitHub Actions, rodando a suíte a cada push/PR
- Execução cross-browser (Firefox, WebKit)
- Paralelização e sharding da suíte em CI
- Ligar os `.feature` à automação com `playwright-bdd`, eliminando a duplicação entre especificação e teste
- Testes de performance/tempo de resposta da API

## 📝 Convenção de commits

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/) para manter o histórico legível:

```
test(carrinho): adiciona cenarios de carrinho em Gherkin
docs(bugs): adiciona report dos bugs encontrados
chore: configura projeto Playwright
```

## 👤 Autor

**Breno Pablo** — [@brenoPVM2](https://github.com/brenoPVM2)