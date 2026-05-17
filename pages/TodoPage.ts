import { expect, Locator, Page } from '@playwright/test';
import { CommonHelper } from '../helpers/commonHelper';

export class TodoPage {
  readonly page: Page;
  readonly helper: CommonHelper;
  readonly newTodoInput: Locator;
  readonly todoListItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;
  readonly allTab: Locator;
  readonly activeTab: Locator;
  readonly completedTab: Locator;
  readonly markAllAsComplete: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new CommonHelper(page);
    this.newTodoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    this.todoListItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' })
    this.allTab = page.getByRole('link', { name: 'All' });
    this.activeTab = page.getByRole('link', { name: 'Active' });
    this.completedTab = page.getByRole('link', { name: 'Completed' });
    this.markAllAsComplete = page.getByText('Mark all as complete');
  }

  async navigate() {
    await this.page.goto('https://demo.playwright.dev/todomvc/index.html#/');
    await this.helper.waitForAppReady();
    await expect(this.newTodoInput).toBeVisible({ timeout: 30000 });
  }

  async addTodo(text: string) {
    await this.newTodoInput.click();
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
    await expect(this.todoListItems.filter({ hasText: text }).first()).toBeVisible();
  }

  async addDefaultTodos(items: string[]) {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  async getItemsLeftCount(): Promise<number> {
    const text = await this.todoCount.textContent();
    return parseInt(text ?? '0', 10);
  }

  getTodoItem(index: number): Locator {
    return this.todoListItems.nth(index);
  }

  async deleteTodoByIndex(index: number) {
    const item = this.getTodoItem(index);
    await item.hover();
    const deleteBtn = item.getByRole('button', { name: 'Delete' });
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();
  }

  async toggleTodoByIndex(index: number) {
    const item = this.getTodoItem(index);
    await item.locator('.toggle').click();
  }

  async toggleTodoByText(text: string) {
    const toggleBtn = this.page.getByRole('listitem').filter({ hasText: text }).getByLabel('Toggle Todo');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
  }

  async clickClearCompleted() {
    await expect(this.clearCompletedButton).toBeVisible();
    await this.clearCompletedButton.click();
  }

  async clickMarkAllAsComplete() {
    await expect(this.markAllAsComplete).toBeVisible();
    await this.markAllAsComplete.click();
  }

  async navigateToAllTab() {
    await this.allTab.click();
  }

  async navigateToActiveTab() {
    await this.activeTab.click();
  }

  async navigateToCompletedTab() {
    await this.completedTab.click();
  }
}
