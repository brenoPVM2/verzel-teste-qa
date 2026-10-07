import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nomeInput: Locator;
  readonly emailInput: Locator;
  readonly cepInput: Locator;
  readonly confirmarBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nomeInput = page.getByLabel('Nome completo');
    this.emailInput = page.getByLabel('E-mail');
    this.cepInput = page.getByLabel('CEP');
    this.confirmarBtn = page.getByRole('button', { name: 'Confirmar pedido' });
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fill(nome?: string, email?: string, cep?: string) {
    if (nome !== undefined) await this.nomeInput.fill(nome);
    if (email !== undefined) await this.emailInput.fill(email);
    if (cep !== undefined) await this.cepInput.fill(cep);
  }

  async confirmar() {
    await this.confirmarBtn.click();
  }

  async getOrderNumber(): Promise<string> {
    const text = await this.page.locator('main').innerText();
    const match = text.match(/VZ-\d{6}/);
    return match ? match[0] : '';
  }

  async getGreeting(): Promise<string> {
    const text = await this.page.locator('main').innerText();
    const match = text.match(/Obrigado, [^.]+\./);
    return match ? match[0] : '';
  }
}
