# TodoMVC - Playwright Automation

This project contains automated End-to-End (E2E) tests for the [TodoMVC Playwright Demo](https://demo.playwright.dev/todomvc/#/) using **Playwright** and **TypeScript**. The tests are designed using the **Page Object Model (POM)** design pattern to ensure maintainability, reusability, and readability.

## 📂 Project Structure

```text
bluepi-playwright-todomvc/
├── data/
│   └── todoData.ts         # Test data (e.g., list of 10 default todo items)
├── helpers/
│   └── commonHelper.ts     # Reusable common methods (e.g., waiting for app ready)
├── interfaces/
│   └── ITodo.ts            # TypeScript interfaces/types definitions
├── pages/
│   └── TodoPage.ts         # Page Object Model encapsulating all TodoMVC UI locators and actions
├── tests/
│   └── todomvc.spec.ts     # The main test specification file containing the 7 test cases
├── playwright.config.ts    # Playwright framework configuration file
├── tsconfig.json           # TypeScript configuration with path aliases
└── package.json            # Node.js dependencies and NPM scripts
```

## ⚙️ Installation & Setup

**Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd "bluepi-playwright-todomvc"
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install chromium
   ```

## 🚀 Running Tests

You can execute the tests using the predefined NPM scripts or NPX commands:

- **Run all tests (Headless Mode):**
  ```bash
  npm run test
  # or
  npx playwright test
  ```
- **Run all tests with UI Mode (Interactive):**
  ```bash
  npm run test:ui
  # or
  npx playwright test --ui
  ```
- **Run tests in Debug Mode:**
  ```bash
  npx playwright test --debug
  ```
- **View HTML Test Report:**
  ```bash
  npm run report
  # or
  npx playwright show-report
  ```

## 🧪 Test Cases Implemented

The test suite contains **7 automated test cases** that execute independently to verify the core functionalities of the TodoMVC application:

1. **TC-01: Add 10 todo items** 
   - Add 10 items successively.
   - Verify that all items appear in the list.
   - Verify the counter correctly displays "10 items left".

2. **TC-02: Delete the 10th item**
   - Add default 10 items.
   - Delete the 10th item in the list.
   - Verify that the counter drops to "9 items left".
   - Verify the specific item is no longer visible in the list.

3. **TC-03: Complete items #1 and #2**
   - Add default items.
   - Mark items #1 and #2 as completed.
   - Verify the counter updates to "7 items left".
   - Verify the "Clear completed" button becomes visible.
   - Verify the completed items appear inside the "Completed" tab.

4. **TC-04: Delete item from the 'Completed' tab**
   - Mark items as completed and navigate to the "Completed" tab.
   - Hover over item #1 and delete it via the destroy button.
   - Verify the item is successfully removed from the completed list.

5. **TC-05: Verify unchecked items in the 'Active' tab**
   - Mark specific items as completed.
   - Navigate to the "Active" tab.
   - Verify that all unchecked items are correctly displayed.
   - Verify that completed items are completely hidden from this view.

6. **TC-06: Delete item from the 'Active' tab**
   - Navigate to the "Active" tab.
   - Delete an active item by hovering over it and clicking the destroy button.
   - Verify the item is removed and the active counter updates accordingly.

7. **TC-07: Clear completed items**
   - Mark items as completed.
   - Click the "Clear completed" button.
   - Verify that checked items are permanently removed from the "Completed", "Active", and "All" tabs.
   - Verify that unchecked items remain completely intact across the "Active" and "All" tabs.
