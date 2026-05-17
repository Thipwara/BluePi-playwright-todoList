import { Page } from '@playwright/test';

export class CommonHelper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForAppReady() {
    await this.page.waitForLoadState('networkidle');
  }
}
