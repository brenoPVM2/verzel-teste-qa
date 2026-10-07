import { Page } from '@playwright/test';

export class CarrinhoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/carrinho');
    await this.waitForRecalculo();
  }

  async isEmpty(): Promise<boolean> {
    return this.page.getByText('Seu carrinho está vazio').isVisible();
  }

  async getQuantity(productName: string): Promise<number> {
    const decreaseBtn = this.page.getByRole('button', {
      name: `Diminuir quantidade de ${productName}`,
    });
    const container = decreaseBtn.locator('..');
    const text = await container.innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async increaseQuantity(productName: string) {
    await this.page
      .getByRole('button', { name: `Aumentar quantidade de ${productName}` })
      .click();
    await this.waitForRecalculo();
  }

  async decreaseQuantity(productName: string) {
    await this.page
      .getByRole('button', { name: `Diminuir quantidade de ${productName}` })
      .click();
    await this.waitForRecalculo();
  }

  async removeItem(productName: string) {
    await this.page
      .getByRole('button', { name: `Remover ${productName} do carrinho` })
      .click();
    await this.waitForRecalculo();
  }

  async emptyCart() {
    await this.page.getByRole('button', { name: 'Esvaziar carrinho' }).click();
    await this.waitForRecalculo();
  }

  async applyCoupon(code: string) {
    await this.page.getByLabel('Cupom de desconto').fill(code);
    await this.page.getByRole('button', { name: 'Aplicar cupom' }).click();
    await this.waitForRecalculo();
  }

  async applyCouponEmpty() {
    await this.page.getByRole('button', { name: 'Aplicar cupom' }).click();
    await this.waitForRecalculo();
  }

  async removeCoupon() {
    await this.page.getByRole('button', { name: 'Remover cupom' }).click();
    await this.waitForRecalculo();
  }

  private async waitForRecalculo() {
    await this.page.waitForLoadState('networkidle');
  }

  private async getSummaryLine(label: string): Promise<string> {
    const text = await this.page.locator('main').innerText();
    const regex = new RegExp(`${label}[^\\n]*\\n([^\\n]+)`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  async getSubtotal() {
    return this.getSummaryLine('Subtotal');
  }

  async getDesconto() {
    return this.getSummaryLine('Desconto');
  }

  async getFrete() {
    return this.getSummaryLine('Frete');
  }

  async getTotal() {
    return this.getSummaryLine('Total');
  }

  async getFaltanteMessage(): Promise<string | null> {
    const text = await this.page.locator('main').innerText();
    const match = text.match(/Faltam .+ para o frete grátis\./);
    return match ? match[0] : null;
  }

  async goToCheckout() {
    await this.page.getByRole('link', { name: 'Finalizar compra' }).click();
  }
}
