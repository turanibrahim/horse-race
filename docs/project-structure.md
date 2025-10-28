# Project Structure

## Overview

This document provides a detailed breakdown of the project's file and folder organization.

## Root Directory

```
horse-racing/
├── docs/                    # Documentation files
├── e2e/                     # End-to-end tests (Playwright)
├── public/                  # Static assets
├── src/                     # Source code
├── coverage/                # Test coverage reports
├── playwright-report/       # E2E test reports
├── test-results/            # Test result artifacts
├── AGENTS.md                # AI agent instructions
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── playwright.config.ts     # Playwright E2E config
├── README.md                # Project readme
├── tsconfig.json            # TypeScript base config
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-specific TS config
├── tsconfig.e2e.json        # E2E-specific TS config
├── vite.config.ts           # Vite configuration
└── vitest.config.ts         # Vitest configuration
```

## Source Directory (`src/`)

### Main Application Files

```
src/
├── main.ts                  # Application entry point
├── app.vue                  # Root Vue component
└── style.css                # Global styles (Tailwind)
```

**`main.ts`**: Bootstraps the Vue application, sets up plugins, and mounts the app.

**`app.vue`**: Root component containing `<RouterView>` for page routing.

**`style.css`**: Global Tailwind CSS imports and custom styles.

### Components (`src/components/`)

Organized using Atomic Design Pattern:

```
components/
├── atoms/                   # Basic building blocks
│   ├── v-button.vue
│   ├── v-drawer.vue
│   ├── v-horse.vue
│   ├── v-select.vue
│   ├── v-table.vue
│   └── __tests__/          # Atom component tests
├── molecules/               # Simple component groups
│   ├── horse-table.vue
│   ├── racing-dashboard-header.vue
│   ├── session-results-table.vue
│   └── __tests__/          # Molecule component tests
└── organisms/               # Complex UI sections
    ├── horse-list-drawer.vue
    ├── race-track.vue
    ├── session-horses-table.vue
    └── __tests__/          # Organism component tests
```

**Naming Convention**: `kebab-case.vue`

**Component Structure**:
```vue
<script setup lang="ts">
// Component logic
</script>

<template>
  <!-- Component template -->
</template>

<style>
/* Component styles (not scoped by default) */
</style>
```

### Pages (`src/pages/`)

```
pages/
├── racing-dashboard.page.vue   # Main racing dashboard
└── theme-preview.page.vue      # Theme preview page
```

**Naming Convention**: `[page-name].page.vue`

**Purpose**: Full-page components mapped to routes.

### Store (`src/store/`)

State management using Pinia:

```
store/
├── index.ts                 # Store exports
├── horse.store.ts           # Horse state management
├── race.store.ts            # Race state management
└── __tests__/              # Store tests
```

**Naming Convention**: `[store-name].store.ts`

**Structure**:
- Each store uses `defineStore` from Pinia
- Composition API style with `setup` function
- Returns reactive state and actions

### Types (`src/types/`)

```
types/
└── index.ts                 # TypeScript type definitions
```

**Contains**:
- `Horse` interface
- `RaceResult` interface
- `Race` interface
- `Session` interface

### Constants (`src/constants/`)

```
constants/
├── index.ts                 # Constant exports
├── horse.constants.ts       # Horse-related constants
└── race.constants.ts        # Race-related constants
```

**horse.constants.ts**:
- `HORSE_NAMES`: Array of horse names
- `HORSE_COLORS`: Array of color hex codes

**race.constants.ts**:
- `RACE_DISTANCES`: Array of race distances (meters)
- `TRACK_LENGTH`: Track length constant
- `BASE_SPEED`: Base speed for animations

### Plugins (`src/plugins/`)

```
plugins/
├── index.ts                 # Plugin setup orchestration
├── router.ts                # Vue Router configuration
├── pinia.ts                 # Pinia store configuration
└── __tests__/              # Plugin tests
```

**Purpose**: Modular initialization of Vue plugins.

### Tests (`src/__tests__/`)

```
__tests__/
└── setup.ts                 # Vitest global setup
```

**Test Structure**:
- Unit tests: `[component-name].spec.ts`
- Co-located with source files in `__tests__/` folders
- Global test setup in `src/__tests__/setup.ts`

### Assets (`src/assets/`)

Static assets like images, fonts, and other media files.

## Configuration Files

### TypeScript Configuration

**`tsconfig.json`**: Base TypeScript configuration
- Extends Vue's recommended config
- Sets up path aliases (`@` → `src`)

**`tsconfig.app.json`**: Application-specific config
- Includes `src/**/*` files
- App-specific compiler options

**`tsconfig.node.json`**: Node.js-specific config
- For Vite config files
- Node-specific types

**`tsconfig.e2e.json`**: E2E test config
- For Playwright tests
- E2E-specific types

### Build Configuration

**`vite.config.ts`**:
```typescript
- Vue plugin
- Tailwind CSS plugin
- Path alias resolution (@)
```

**`vitest.config.ts`**:
```typescript
- Test environment: happy-dom
- Coverage configuration
- Path aliases
- Test file patterns
```

**`playwright.config.ts`**:
```typescript
- Browser configurations
- Test directory: e2e/
- Reporter settings
```

### Linting Configuration

**`eslint.config.js`**:
- TypeScript ESLint rules
- Vue ESLint plugin
- Custom rule configurations

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of:
import Component from '../../components/atoms/v-button.vue'

// Use:
import Component from '@/components/atoms/v-button.vue'
```

**Configured in**:
- `vite.config.ts`
- `vitest.config.ts`
- `tsconfig.json`

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Vue Components | `kebab-case.vue` | `v-button.vue` |
| Pages | `[name].page.vue` | `racing-dashboard.page.vue` |
| Stores | `[name].store.ts` | `horse.store.ts` |
| Tests | `[name].spec.ts` | `v-button.spec.ts` |
| Types | `kebab-case.ts` | `index.ts` |
| Constants | `[name].constants.ts` | `horse.constants.ts` |

## Import Order

Follow this order for imports:

1. Vue core imports
2. Third-party libraries
3. Type imports
4. Stores
5. Components
6. Utils/Constants
7. Styles

Example:
```typescript
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Horse } from '@/types';
import { useHorseStore } from '@/store/horse.store';
import VButton from '@/components/atoms/v-button.vue';
import { HORSE_COLORS } from '@/constants';
```

## Build Output

```
dist/
├── assets/              # Bundled JS and CSS
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html          # Entry HTML
```

Generated by running `npm run build`.
