import { test, expect } from '@playwright/test';
import { ProdutosPage } from '../../pages/ProdutosPage';
import { CarrinhoPage } from '../../pages/CarrinhoPage';

test.describe('Cupom de desconto e frete grátis', () => {
  test('CUPOM-01 - aplica cupom valido', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Calça Jeans Slim'); // R$139,90
    await produtos.addToCart('Boné Aba Curva'); // R$49,90
    await carrinho.goto();
    await carrinho.increaseQuantity('Boné Aba Curva'); // 2x = R$99,80 -> subtotal R$239,70

    await carrinho.applyCoupon('BEMVINDO10');

    await expect.poll(() => carrinho.getDesconto()).toContain('23,97');
    await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
  });

  test('CUPOM-02 - cupom e case-insensitive e ignora espacos', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Calça Jeans Slim');
    await produtos.addToCart('Boné Aba Curva');
    await carrinho.goto();
    await carrinho.increaseQuantity('Boné Aba Curva');

    await carrinho.applyCoupon('  bemvindo10  ');

    await expect.poll(() => carrinho.getDesconto()).toContain('23,97');
  });

  test('CUPOM-03 - aplicar cupom inexistente', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await carrinho.goto();
    await carrinho.applyCoupon('CUPOMFALSO');

    await expect(page.getByText('Cupom inválido.')).toBeVisible();
    await expect.poll(() => carrinho.getDesconto()).toBe('R$ 0,00');
  });

  test('CUPOM-04 - aplicar cupom expirado', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await carrinho.goto();
    await carrinho.applyCoupon('VERAO2026');

    await expect(page.getByText('Cupom expirado.')).toBeVisible();
  });

  test('CUPOM-05 - tentar aplicar cupom sem preencher o campo', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await carrinho.goto();
    await carrinho.applyCouponEmpty();

    await expect(page.getByText('Informe um cupom.')).toBeVisible();
  });

  test('CUPOM-06 - remover cupom aplicado libera o campo para nova tentativa', async ({
    page,
  }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await carrinho.goto();
    await carrinho.applyCoupon('BEMVINDO10');
    await expect(page.getByRole('button', { name: 'Remover cupom' })).toBeVisible();

    await carrinho.removeCoupon();

    await expect(page.getByLabel('Cupom de desconto')).toBeVisible();
    await expect.poll(() => carrinho.getDesconto()).toBe('R$ 0,00');
  });

  test('CUPOM-07 - frete gratis para subtotal acima de R$ 200,00', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Tênis Casual Urbano'); // R$189,90
    await produtos.addToCart('Boné Aba Curva'); // R$49,90 -> subtotal R$239,80
    await carrinho.goto();

    await expect.poll(() => carrinho.getSubtotal()).toBe('R$ 239,80');
    await expect.poll(() => carrinho.getFrete()).toBe('Grátis');
  });

  test('CUPOM-07b - no limite exato de R$ 200,00 o frete deveria ser gratis', async ({
    page,
  }) => {
    test.fail(
      true,
      'Bug conhecido (BUG-03): em R$200,00 exatos o frete continua sendo cobrado, apesar da CA06 dizer "inclusive". Ver docs/bugs.md#bug-03'
    );

    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Mochila Urbana 20L');
    await produtos.addToCart('Mochila Urbana 20L'); // 2x = R$200,00 exatos
    await carrinho.goto();

    await expect.poll(() => carrinho.getSubtotal()).toBe('R$ 200,00');
    await expect.poll(() => carrinho.getFrete()).toBe('Grátis');
  });

  test('CUPOM-08 - frete fixo abaixo de R$ 200,00', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial'); // R$59,90
    await carrinho.goto();

    await expect.poll(() => carrinho.getFrete()).toBe('R$ 19,90');
    await expect
      .poll(() => carrinho.getFaltanteMessage())
      .toBe('Faltam R$ 140,10 para o frete grátis.');
  });

  test('CUPOM-09 - valor faltante para o frete gratis', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Boné Aba Curva'); // 49,90
    await produtos.addToCart('Garrafa Térmica 750ml'); // 50,00
    await produtos.addToCart('Kit 3 Pares de Meias'); // 29,90 -> subtotal 129,80
    await carrinho.goto();

    await expect
      .poll(() => carrinho.getFaltanteMessage())
      .toBe('Faltam R$ 70,20 para o frete grátis.');
  });

  test('CUPOM-09b - sem mensagem de faltante quando o frete ja e gratis', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Tênis Casual Urbano'); // R$189,90
    await produtos.addToCart('Boné Aba Curva'); // R$49,90 -> subtotal R$239,80
    await carrinho.goto();

    await expect.poll(() => carrinho.getFaltanteMessage()).toBeNull();
  });

  test('CUPOM-10 - frete gratis considera o subtotal antes do desconto', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Tênis Casual Urbano'); // R$189,90
    await produtos.addToCart('Boné Aba Curva'); // R$49,90 -> subtotal R$239,80
    await carrinho.goto();
    await carrinho.applyCoupon('BEMVINDO10');

    await expect.poll(() => carrinho.getFrete()).toBe('Grátis');
  });

  test('CUPOM-11 - desconto do cupom nao incide sobre o frete', async ({ page }) => {
    const produtos = new ProdutosPage(page);
    const carrinho = new CarrinhoPage(page);

    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await carrinho.goto();
    await carrinho.applyCoupon('BEMVINDO10');

    await expect.poll(() => carrinho.getFrete()).toBe('R$ 19,90');
  });
});
