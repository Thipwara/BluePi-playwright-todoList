import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import { TODO_ITEMS } from '../data/todoData';

test.describe('TodoList - Playwright Automation', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });


  test('TC-01: Add 10 todo items and verify counter shows 10', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await expect(todoPage.todoListItems).toHaveCount(10);
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(10);

    for (let i = 0; i < TODO_ITEMS.length; i++) {
      await expect(todoPage.getTodoItem(i)).toContainText(TODO_ITEMS[i]);
    }
  });

  // ============================================================
  // TC-02: ลบ list ที่ 10 และตรวจสอบ counter = 9
  // ============================================================
  test('TC-02: Delete item #10 and verify counter drops to 9', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await expect(todoPage.todoListItems).toHaveCount(10);

    await todoPage.deleteTodoByIndex(9);

    await expect(todoPage.todoListItems).toHaveCount(9);
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(9);

    const itemsAfterDelete = todoPage.todoListItems;
    for (let i = 0; i < 9; i++) {
      await expect(itemsAfterDelete.nth(i)).not.toContainText('Study TypeScript');
    }
  });

  // ============================================================
  // TC-03: Tick item #1 และ #2, ตรวจสอบ completed tab, counter = 7, clear completed button
  // ============================================================
  test('TC-03: Check items #1 and #2 as completed, verify completed tab and counter = 7', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await expect(todoPage.todoListItems).toHaveCount(10);

    // ลบรายการสุดท้ายออกไปก่อนเพื่อให้ counter กลายเป็น 7
    await todoPage.deleteTodoByIndex(9);
    await expect(todoPage.todoListItems).toHaveCount(9);

    // Tick item #1 และ #2
    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);

    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(7);

    await expect(todoPage.clearCompletedButton).toBeVisible();

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(2);
    await expect(todoPage.getTodoItem(0)).toContainText(TODO_ITEMS[0]);
    await expect(todoPage.getTodoItem(1)).toContainText(TODO_ITEMS[1]);
  });

  // ============================================================
  // TC-04: ลบ item #1 ในหน้า Completed โดย hover แล้วกด delete
  // ============================================================
  test('TC-04: Delete item #1 from Completed tab by hovering at end of list', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    
    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(2);

    await todoPage.deleteTodoByIndex(0);

    await expect(todoPage.todoListItems).toHaveCount(1);
    await expect(todoPage.getTodoItem(0)).toContainText(TODO_ITEMS[1]);
  });

  // ============================================================
  // TC-05: ตรวจสอบว่า list ที่ไม่ถูก tick จะอยู่ในหน้า Active
  // ============================================================
  test('TC-05: Unchecked items appear in Active tab', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(8);

    for (let i = 0; i < 8; i++) {
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[0]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[1]);
    }

    for (let i = 2; i < TODO_ITEMS.length; i++) {
      await expect(todoPage.todoListItems.filter({ hasText: TODO_ITEMS[i] })).toBeVisible();
    }
  });

  // ============================================================
  // TC-06: ลบ item ในหน้า Active โดย hover แล้วกด delete
  // ============================================================
  test('TC-06: Delete an item from Active tab by hovering at end of list', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(8);

    await todoPage.deleteTodoByIndex(0);

    await expect(todoPage.todoListItems).toHaveCount(7);
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(7);
  });

  // ============================================================
  // TC-07: Clear completed ลบเฉพาะ completed items, ไม่กระทบ active/all
  // ============================================================
  test('TC-07: Clear completed removes only completed items from all tabs', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);

    await expect(todoPage.clearCompletedButton).toBeVisible();

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(2);

    await todoPage.clickClearCompleted();
    await expect(todoPage.todoListItems).toHaveCount(0);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(8);

    for (let i = 0; i < 8; i++) {
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[0]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[1]);
    }

    await todoPage.navigateToAllTab();
    await expect(todoPage.todoListItems).toHaveCount(8);

    for (let i = 2; i < TODO_ITEMS.length; i++) {
      await expect(todoPage.todoListItems.filter({ hasText: TODO_ITEMS[i] })).toBeVisible();
    }

    for (let i = 0; i < 8; i++) {
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[0]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[1]);
    }
  });

});
