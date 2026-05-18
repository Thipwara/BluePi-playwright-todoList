import { Page } from '@playwright/test';

export class CommonHelper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForAppReady() {
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTextsNotInList(listLocator: any, texts: string[]) {
    for (const text of texts) {
      await require('@playwright/test').expect(listLocator.filter({ hasText: text })).toHaveCount(0);
    }
  }

  async verifyTextsInList(listLocator: any, texts: string[]) {
    for (const text of texts) {
      await require('@playwright/test').expect(listLocator.filter({ hasText: text }).first()).toBeVisible();
    }
  }
}
