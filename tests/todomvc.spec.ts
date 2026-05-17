import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import { TODO_ITEMS } from '../data/todoData';

test.describe('TodoList - Playwright Automation', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });


  test('TC-01: Add 10 todo items and verify counter shows 10 items correctly', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await expect(todoPage.todoListItems).toHaveCount(10);
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(10);

    for (let i = 0; i < TODO_ITEMS.length; i++) {
      await expect(todoPage.getTodoItem(i)).toContainText(TODO_ITEMS[i]);
    }
  });


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

  test('TC-03: Check items #1 and #2 as completed, verify completed tab and counter = 8', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await expect(todoPage.todoListItems).toHaveCount(10);

    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);

    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(8);

    await expect(todoPage.clearCompletedButton).toBeVisible();

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(2);
    await expect(todoPage.getTodoItem(0)).toContainText(TODO_ITEMS[0]);
    await expect(todoPage.getTodoItem(1)).toContainText(TODO_ITEMS[1]);
  });


  test('TC-04: Delete item from Completed tab by hovering at end of list', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    
    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(2);

    await todoPage.deleteTodoByIndex(0);

    await expect(todoPage.todoListItems).toHaveCount(1);
    await expect(todoPage.getTodoItem(0)).toContainText(TODO_ITEMS[1]);
  });

  test('TC-05: Unchecked items appear in Active tab', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await todoPage.toggleTodoByIndex(0);
    await todoPage.toggleTodoByIndex(1);
    await todoPage.toggleTodoByText(TODO_ITEMS[2]);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(7);

    for (let i = 0; i < 7; i++) {
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[0]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[1]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[2]);
    }

    for (let i = 3; i < TODO_ITEMS.length; i++) {
      await expect(todoPage.todoListItems.filter({ hasText: TODO_ITEMS[i] })).toBeVisible();
    }
  });


  test('TC-06: Delete an item from Active tab by hovering at end of list', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await todoPage.toggleTodoByText(TODO_ITEMS[0]);
    await todoPage.toggleTodoByText(TODO_ITEMS[1]);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(8);

    await todoPage.deleteTodoByIndex(0);

    await expect(todoPage.todoListItems).toHaveCount(7);
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(7);
  });

  test('TC-07: Clear completed removes only completed items', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await todoPage.toggleTodoByText(TODO_ITEMS[0]);
    await todoPage.toggleTodoByText(TODO_ITEMS[1]);

    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(8);
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

   test('TC-08: When clear completed from another tab, completed items should be removed from all tabs not only completed tabs', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    await todoPage.toggleTodoByIndex(3);
    await todoPage.toggleTodoByIndex(4);
    await todoPage.toggleTodoByIndex(5);

    await expect(todoPage.clearCompletedButton).toBeVisible();
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(7);

    await todoPage.clickClearCompleted();
  

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(7);

    for (let i = 0; i < 7; i++) {
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[3]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[4]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[5]);
    }

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(0);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(7);

    for (let i = 0; i < 7; i++) {
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[3]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[4]);
      await expect(todoPage.getTodoItem(i)).not.toContainText(TODO_ITEMS[5]);
    }
  });

  test('TC-09: Mark all as complete', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await expect(todoPage.todoListItems).toHaveCount(10);
 
    await todoPage.clickMarkAllAsComplete();
    await expect(todoPage.todoListItems).toHaveCount(10);
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(0);
    await expect(todoPage.clearCompletedButton).toBeVisible();

    await todoPage.navigateToAllTab();
    await expect(todoPage.todoListItems).toHaveCount(10);

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(10);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(0);
    
  });

  test('TC-10: Mark all as complete and then click mark all as complete again', async () => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await expect(todoPage.todoListItems).toHaveCount(10);

    await todoPage.clickMarkAllAsComplete();
    await expect(todoPage.todoListItems).toHaveCount(10);
    const count = await todoPage.getItemsLeftCount();
    expect(count).toBe(0);
    await expect(todoPage.clearCompletedButton).toBeVisible();

    await todoPage.clickMarkAllAsComplete();
    await expect(todoPage.todoListItems).toHaveCount(10);
    const count1 = await todoPage.getItemsLeftCount();
    expect(count1).toBe(10);
    await expect(todoPage.clearCompletedButton).not.toBeVisible();

    await todoPage.navigateToAllTab();
    await expect(todoPage.todoListItems).toHaveCount(10);

    await todoPage.navigateToCompletedTab();
    await expect(todoPage.todoListItems).toHaveCount(0);

    await todoPage.navigateToActiveTab();
    await expect(todoPage.todoListItems).toHaveCount(10);
  });

});
