import { Page, Locator } from '@playwright/test';

export class ProdutosPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  private addToCartButton(productName: string): Locator {
    const heading = this.page.getByRole('heading', { name: productName, exact: true });
    return heading.locator(
      `xpath=following::button[normalize-space(text())="Adicionar ao carrinho"][1]`
    );
  }

  async addToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }

  async getCartCount(): Promise<number> {
    const text = await this.page.getByText(/\d+ itens? no carrinho/).textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
