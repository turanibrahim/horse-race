# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/horse-racing.git
cd horse-racing
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Vue 3 and related libraries
- TypeScript tooling
- Testing frameworks
- Development tools

## Development

### Start Development Server

```bash
npm run dev
```

This starts the Vite development server with:
- Hot Module Replacement (HMR)
- Fast refresh for Vue components
- TypeScript type checking
- Default port: `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors

# Testing
npm run test             # Run unit tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:run         # Run tests once
npm run test:coverage    # Generate coverage report
npm run test:coverage:ui # View coverage in UI

# E2E Testing
npm run test:e2e         # Run Playwright tests
npm run test:e2e:ui      # Run E2E tests in UI mode
npm run test:e2e:debug   # Debug E2E tests
npm run test:e2e:headed  # Run E2E tests with browser visible
npm run test:e2e:report  # Show E2E test report
```

## Project Setup Verification

After installation, verify your setup:

### 1. Check Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and you should see the racing dashboard.

### 2. Run Linting

```bash
npm run lint
```

Should complete without errors.

### 3. Run Tests

```bash
npm run test:run
```

All tests should pass.

## IDE Setup

### Visual Studio Code (Recommended)

**Recommended Extensions:**

1. **Volar** (Vue Language Features)
   - Official Vue 3 language support
   - Install: `Vue.volar`

2. **TypeScript Vue Plugin (Volar)**
   - TypeScript support in Vue files
   - Install: `Vue.vscode-typescript-vue-plugin`

3. **ESLint**
   - Live linting feedback
   - Install: `dbaeumer.vscode-eslint`

4. **Tailwind CSS IntelliSense**
   - Tailwind class autocompletion
   - Install: `bradlc.vscode-tailwindcss`

5. **Prettier** (Optional)
   - Code formatting
   - Install: `esbenp.prettier-vscode`

**VSCode Settings:**

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ],
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Browser Setup

The application is tested and works best with:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Minimum browser requirements:
- ES2020+ support
- CSS Grid support
- Modern JavaScript features

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill process on port 5173 (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 3000
```

### Node Modules Issues

If you encounter dependency issues:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

Ensure your TypeScript version matches:

```bash
# Check TypeScript version
npx tsc --version  # Should be ~5.9.3
```

### Build Errors

Clear Vite cache:

```bash
# Remove Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Next Steps

Now that you have the project running:

1. Read the [Architecture Overview](./architecture.md) to understand the project structure
2. Review the [Development Guide](./development-guide.md) for coding standards
3. Explore the [Component Library](./components.md) to see available components
4. Check the [Testing Guide](./testing.md) to learn about testing practices

## Getting Help

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join GitHub Discussions
- **Documentation**: Check other docs in the `docs/` folder
