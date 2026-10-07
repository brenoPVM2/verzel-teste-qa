import { test, expect } from '@playwright/test';

test.describe('API - Confirmação de pedido', () => {
  test('API-PED-01 - confirma pedido com dados validos', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: {
        cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
        itens: [{ produtoId: 'P005', quantidade: 1 }],
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.numero).toMatch(/^VZ-\d{6}$/);
  });

  test('API-PED-02 - pedido com cupom invalido retorna erro', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: {
        cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
        itens: [{ produtoId: 'P005', quantidade: 1 }],
        cupom: 'CUPOMFALSO',
      },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.erro.codigo).toBe('CUPOM_INVALIDO');
  });

  test('API-PED-03 - pedido com cupom expirado retorna erro', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: {
        cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
        itens: [{ produtoId: 'P005', quantidade: 1 }],
        cupom: 'VERAO2026',
      },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.erro.codigo).toBe('CUPOM_EXPIRADO');
  });

  const camposInvalidos = [
    { campo: 'nome', cliente: { nome: 'Maria', email: 'maria@exemplo.com', cep: '01310-100' } },
    {
      campo: 'email',
      cliente: { nome: 'Maria Silva', email: 'maria-exemplo.com', cep: '01310-100' },
    },
    {
      campo: 'cep',
      cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '1310-10' },
    },
  ];

  for (const caso of camposInvalidos) {
    test(`API-PED-04 - validacao de dados do cliente: ${caso.campo}`, async ({ request }) => {
      const res = await request.post('/api/pedidos', {
        data: { cliente: caso.cliente, itens: [{ produtoId: 'P001', quantidade: 1 }] },
      });

      expect(res.status()).toBe(422);
      const body = await res.json();
      expect(body.erro.codigo).toBe('DADOS_INVALIDOS');
      expect(body.erro.campos[0].campo).toBe(`cliente.${caso.campo}`);
    });
  }

  test('API-PED-05 - pedido reflete o mesmo calculo do carrinho', async ({ request }) => {
    const itens = [{ produtoId: 'P003', quantidade: 1 }];
    const cupom = 'BEMVINDO10';

    const calculoRes = await request.post('/api/carrinho/calcular', {
      data: { itens, cupom },
    });
    const calculo = await calculoRes.json();

    const pedidoRes = await request.post('/api/pedidos', {
      data: {
        cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
        itens,
        cupom,
      },
    });
    const pedido = await pedidoRes.json();

    expect(pedido.subtotal).toBe(calculo.subtotal);
    expect(pedido.desconto).toBe(calculo.desconto);
    expect(pedido.frete).toBe(calculo.frete);
    expect(pedido.total).toBe(calculo.total);
  });

  // BUG-01 (docs/bugs.md#bug-01): o limite de 5 unidades tambem nao e respeitado
  // ao confirmar um pedido, nao so ao calcular o carrinho (ver EXP-02 em
  // docs/test-execution.md). Assert no comportamento esperado pela spec.
  test('API-PED-EXP-02 - limite de 5 unidades deveria ser respeitado ao confirmar pedido', async ({
    request,
  }) => {
    test.fail(
      true,
      'Bug conhecido (BUG-01): /api/pedidos aceita quantidade acima de 5. Ver docs/bugs.md#bug-01'
    );

    const res = await request.post('/api/pedidos', {
      data: {
        cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
        itens: [{ produtoId: 'P005', quantidade: 10 }],
      },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });
});
