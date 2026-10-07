import { test, expect } from '@playwright/test';
import { ProdutosPage } from '../../pages/ProdutosPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Finalização do pedido', () => {
  test.beforeEach(async ({ page }) => {
    const produtos = new ProdutosPage(page);
    await produtos.goto();
    await produtos.addToCart('Camiseta Essencial');
    await page.goto('/checkout');
  });

  test('PED-01 - confirma pedido com dados validos', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fill('Maria Silva', 'maria@exemplo.com', '01310-100');
    await checkout.confirmar();

    await expect(page.getByText('Pedido confirmado')).toBeVisible();
    expect(await checkout.getOrderNumber()).toMatch(/^VZ-\d{6}$/);
    expect(await checkout.getGreeting()).toBe('Obrigado, Maria.');
  });

  test('PED-02 - submeter formulario vazio', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.confirmar();

    await expect(page.getByText('Informe o nome completo.')).toBeVisible();
    await expect(page.getByText('Informe o e-mail.')).toBeVisible();
    await expect(page.getByText('Informe o CEP.')).toBeVisible();
  });

  test('PED-03 - nome sem sobrenome e invalido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fill('Maria', 'maria@exemplo.com', '01310-100');
    await checkout.confirmar();

    await expect(page.getByText('Informe nome e sobrenome.')).toBeVisible();
  });

  test('PED-04 - email em formato invalido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fill('Maria Silva', 'maria-arroba-exemplo.com', '01310-100');
    await checkout.confirmar();

    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
  });

  test('PED-05 - cep com menos de 8 digitos e invalido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fill('Maria Silva', 'maria@exemplo.com', '1310-10');
    await checkout.confirmar();

    await expect(page.getByText('Informe um CEP com 8 dígitos.')).toBeVisible();
  });

  for (const cep of ['01310100', '01310-100']) {
    test(`PED-06 - cep aceita o formato "${cep}"`, async ({ page }) => {
      const checkout = new CheckoutPage(page);
      await checkout.fill('Maria Silva', 'maria@exemplo.com', cep);
      await checkout.confirmar();

      await expect(page.getByText('Pedido confirmado')).toBeVisible();
    });
  }

  test('PED-07 - carrinho e esvaziado apos confirmar o pedido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fill('Maria Silva', 'maria@exemplo.com', '01310-100');
    await checkout.confirmar();
    await expect(page.getByText('Pedido confirmado')).toBeVisible();

    await page.goto('/carrinho');
    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible();
  });
});
