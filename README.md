# TodoMVC Playwright Automation (POM)

This project contains Playwright automated tests for the TodoMVC application using TypeScript and the Page Object Model (POM) design pattern.

## Project Structure

The project is structured to separate concerns and make tests more maintainable:

- `interfaces/` : TypeScript interfaces and types
- `data/` : Test data and constants
- `pages/` : Page Object classes encapsulating the UI elements and actions
- `helpers/` : Reusable helper functions
- `tests/` : The actual Playwright test files

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Running Tests

Run tests in headless mode (default):
```bash
npm run test
```

Run tests with Playwright UI:
```bash
npm run test:ui
```

View HTML report:
```bash
npm run report
```
