import { test, expect } from '@playwright/test';

test.describe('API - Produtos', () => {
  test('API-PROD-01 - lista todos os produtos', async ({ request }) => {
    const res = await request.get('/api/produtos');
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('nome');
    expect(body[0]).toHaveProperty('descricao');
    expect(body[0]).toHaveProperty('categoria');
    expect(body[0]).toHaveProperty('preco');
  });

  test('API-PROD-02 - consulta um produto existente pelo id', async ({ request }) => {
    const res = await request.get('/api/produtos/P001');
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.nome).toBe('Camiseta Essencial');
  });

  test('API-PROD-03 - consulta um produto inexistente', async ({ request }) => {
    const res = await request.get('/api/produtos/P999');
    expect(res.status()).toBe(404);

    const body = await res.json();
    expect(body.erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
  });
});
