# EliasStrand-FED22-JavaScript 2

## Social Media Platform – Workflow Project

### FED22 – Workflow Course Assignment

This project was created as part of the Workflow assignment in the FED22 course.  
The goal was to set up a professional development environment with tools for testing, formatting, and managing commits.

---

## Features

- ESLint and Prettier setup for consistent and clean code formatting
- Unit tests with Vitest for utility functions
- End-to-End tests with Playwright for login, registration, and navigation flows
- Pre-commit hooks via Husky and lint-staged
- `.env` environment variable handling
- Clean project structure with separation of concerns (`utils`, `tests`, `e2e`)

---

## Installation depemdemcies: 

npm install

## Environment Variables

1. Copy .env.example to .env:

cp .env.example .env

2. Update the .env file with your values:

VITE_API_URL=https://api.noroff.dev
VITE_API_KEY=your-api-key
VITE_BASE_URL=http://localhost:5173

TEST_EMAIL=your-login-email@example.com
TEST_PASSWORD=your-password

TEST_REG_NAME=Testbruker
TEST_REG_EMAIL=test@example.com
TEST_REG_PASSWORD=hemmelig123

## Running Tests

1. Unit test with Vitest:

npm run test:unit

## End-to-End tests with Playwright

1. Start the dev server:

npm run dev

npm run test:e2e

## Pre-commit Hook

1. This project uses Husky and lint-staged to automatically lint and format files before committing.

To set it up locally:

npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

When committing, ESLint and Prettier will automatically run on staged files.


## Submission Checklist

- [x] All tests pass (login, register, navigation)
- [x] ESLint + Prettier setup complete
- [x] `.env` is created locally, `.env.example` is included
- [x] Pre-commit hook with Husky + lint-staged is working
- [x] Project structure is clean and documented


 ## GitHub Repository

 https://github.com/stel2604/EliasStrand-FED22-JavaScript-2
 