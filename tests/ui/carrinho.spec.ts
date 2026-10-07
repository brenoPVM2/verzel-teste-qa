import { test, expect } from '@playwright/test';
import { ProdutosPage } from '../../pages/ProdutosPage';
import { CarrinhoPage } from '../../pages/CarrinhoPage';

test.describe('Carrinho de compras', () => {
  test('CARR-01 - adiciona um produto ao carrinho', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');

    await carrinho.goto();
    await expect(page.getByText('Camiseta Essencial')).toBeVisible();
    await expect.poll(() => carrinho.getSubtotal()).toBe('R$ 59,90');
  });

  test('CARR-02 - aumenta a quantidade de um produto no carrinho', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Boné Aba Curva');
    await carrinho.goto();

    await carrinho.increaseQuantity('Boné Aba Curva');
    await carrinho.increaseQuantity('Boné Aba Curva');

    expect(await carrinho.getQuantity('Boné Aba Curva')).toBe(3);
    await expect.poll(() => carrinho.getSubtotal()).toBe('R$ 149,70');
  });

  test('CARR-03 - nao permite mais de 5 unidades do mesmo produto', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Kit 3 Pares de Meias');
    await carrinho.goto();

    for (let i = 0; i < 4; i++) {
      await carrinho.increaseQuantity('Kit 3 Pares de Meias');
    }

    expect(await carrinho.getQuantity('Kit 3 Pares de Meias')).toBe(5);
    await expect(page.getByText('Limite de 5 unidades por produto.')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Aumentar quantidade de Kit 3 Pares de Meias' })
    ).toBeDisabled();
  });

  test('CARR-04 - remove um produto do carrinho', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Mochila Urbana 20L');
    await carrinho.goto();
    await carrinho.removeItem('Mochila Urbana 20L');

    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible();
  });

  test('CARR-05 - esvazia o carrinho', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await produtos.addToCart('Boné Aba Curva');
    await produtos.addToCart('Kit 3 Pares de Meias');

    await carrinho.goto();
    await carrinho.emptyCart();

    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible();
  });

  test('CARR-06 - nao permite quantidade menor que 1', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await carrinho.goto();

    expect(await carrinho.getQuantity('Camiseta Essencial')).toBe(1);
    await expect(
      page.getByRole('button', { name: 'Diminuir quantidade de Camiseta Essencial' })
    ).toBeDisabled();
  });

  test('CARR-07 - adicionar o mesmo produto duas vezes soma a quantidade', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await produtos.addToCart('Camiseta Essencial');

    await carrinho.goto();
    expect(await carrinho.getQuantity('Camiseta Essencial')).toBe(2);
    await expect(page.getByText('Camiseta Essencial')).toHaveCount(1);
  });

  test('CARR-08 - carrinho vazio exibe estado vazio', async ({ page }) => {
    const carrinho = new CarrinhoPage(page);
    await carrinho.goto();

    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver produtos' })).toBeVisible();
  });

  test('CARR-09 - nao e possivel finalizar compra com carrinho vazio', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible();
  });
});
