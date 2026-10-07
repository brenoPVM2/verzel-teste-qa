import { test, expect } from '@playwright/test';

test.describe('API - Cálculo do carrinho', () => {
  test('API-CALC-01 - calcula carrinho sem cupom', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: {
        itens: [
          { produtoId: 'P002', quantidade: 1 },
          { produtoId: 'P004', quantidade: 2 },
        ],
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.subtotal).toBe(239.7);
    expect(body.desconto).toBe(0);
    expect(body.total).toBe(239.7);
  });

  test('API-CALC-02 - calcula carrinho com cupom valido', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: {
        itens: [
          { produtoId: 'P002', quantidade: 1 },
          { produtoId: 'P004', quantidade: 2 },
        ],
        cupom: 'BEMVINDO10',
      },
    });

    const body = await res.json();
    expect(body.desconto).toBe(23.97);
    expect(body.total).toBe(215.73);
  });

  test('API-CALC-03 - cupom invalido nao gera erro', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: 'CUPOMFALSO' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.cupom.aplicado).toBe(false);
    expect(body.cupom.mensagem).toBe('Cupom inválido.');
  });

  test('API-CALC-04 - cupom expirado nao gera erro', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: 'VERAO2026' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.cupom.mensagem).toBe('Cupom expirado.');
  });

  const casosDeErro = [
    { nome: 'sem itens', payload: {}, status: 422, codigo: 'ITENS_OBRIGATORIOS' },
    {
      nome: 'produto inexistente',
      payload: { itens: [{ produtoId: 'P999', quantidade: 1 }] },
      status: 422,
      codigo: 'PRODUTO_NAO_ENCONTRADO',
    },
    {
      nome: 'item duplicado',
      payload: {
        itens: [
          { produtoId: 'P001', quantidade: 1 },
          { produtoId: 'P001', quantidade: 1 },
        ],
      },
      status: 422,
      codigo: 'ITEM_DUPLICADO',
    },
    {
      nome: 'quantidade igual a 0',
      payload: { itens: [{ produtoId: 'P001', quantidade: 0 }] },
      status: 422,
      codigo: 'QUANTIDADE_INVALIDA',
    },
  ];

  for (const caso of casosDeErro) {
    test(`API-CALC-05 - ${caso.nome} -> ${caso.codigo}`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', { data: caso.payload });
      expect(res.status()).toBe(caso.status);

      const body = await res.json();
      expect(body.erro.codigo).toBe(caso.codigo);
    });
  }

  test('API-CALC-05 - corpo nao e JSON valido -> JSON_INVALIDO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      headers: { 'Content-Type': 'application/json' },
      data: 'isso nao e um json valido',
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.erro.codigo).toBe('JSON_INVALIDO');
  });

  // BUG-02: item sem "quantidade" deveria retornar ITEM_INVALIDO,
  // conforme a documentação, mas a API retorna QUANTIDADE_INVALIDA.
  // O teste abaixo valida o comportamento ESPERADO (spec), não o atual por isso
  // está marcado com test.fail(): ele falha hoje de propósito, e passará a "passar
  // inesperadamente" (alertando a gente) quando o bug for corrigido.
  test('API-CALC-05b - item sem quantidade deveria retornar ITEM_INVALIDO', async ({
    request,
  }) => {
    test.fail(
      true,
      'Bug conhecido (BUG-02): API retorna QUANTIDADE_INVALIDA em vez de ITEM_INVALIDO. Ver docs/bugs.md#bug-02'
    );

    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001' }] },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.erro.codigo).toBe('ITEM_INVALIDO');
  });

  // BUG-01: a API deveria rejeitar quantidade > 5 (CA10), mas aceita normalmente.
  test('API-CALC-05c - quantidade acima de 5 deveria ser rejeitada', async ({ request }) => {
    test.fail(
      true,
      'Bug conhecido (BUG-01): API nao aplica o limite de 5 unidades por produto. Ver docs/bugs.md#bug-01'
    );

    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 6 }] },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  // BUG-03 (docs/bugs.md#bug-03): a CA06 diz que o frete e gratis "a partir de
  // R$ 200,00, inclusive". No limite exato, a API retorna freteGratis:false e
  // frete:19.9, mas valorFaltanteFreteGratis:0 - os dois campos se contradizem.
  test('API-CALC-08 - no limite exato de R$ 200,00 o frete deveria ser gratis', async ({
    request,
  }) => {
    test.fail(
      true,
      'Bug conhecido (BUG-03): em R$200,00 exatos a API cobra frete (freteGratis:false) apesar da CA06 dizer "inclusive". Ver docs/bugs.md#bug-03'
    );

    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P005', quantidade: 2 }] }, // 2x R$100,00 = R$200,00
    });

    const body = await res.json();
    expect(body.subtotal).toBe(200);
    expect(body.freteGratis).toBe(true);
    expect(body.frete).toBe(0);
  });

  test('API-CALC-06 - rota inexistente', async ({ request }) => {
    const res = await request.get('/api/rota-que-nao-existe');
    expect(res.status()).toBe(404);

    const body = await res.json();
    expect(body.erro.codigo).toBe('ROTA_NAO_ENCONTRADA');
  });

  test('API-CALC-07 - metodo HTTP nao permitido', async ({ request }) => {
    const res = await request.delete('/api/carrinho/calcular');
    expect(res.status()).toBe(405);

    const body = await res.json();
    expect(body.erro.codigo).toBe('METODO_NAO_PERMITIDO');
  });
});
