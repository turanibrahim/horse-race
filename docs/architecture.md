# Architecture Overview

## Technology Stack

### Core Technologies
- **Vue 3** - Progressive JavaScript framework (v3.5.22)
- **TypeScript** - Type-safe JavaScript (v5.9.3)
- **Vite** - Build tool and dev server (Rolldown v7.1.14)
- **Pinia** - State management library (v3.0.3)
- **Vue Router** - Official routing solution (v4.6.3)

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **@headlessui/vue** - Unstyled, accessible UI components

### Testing
- **Vitest** - Unit testing framework
- **@vue/test-utils** - Vue component testing utilities
- **Playwright** - E2E testing framework
- **Happy DOM** - Lightweight DOM implementation

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vue ESLint Plugin** - Vue-specific linting rules

## Design Patterns

### Atomic Design Pattern

The application follows the Atomic Design methodology for component organization:

```
components/
├── atoms/         # Basic building blocks (buttons, inputs)
├── molecules/     # Simple component groups
├── organisms/     # Complex UI sections
└── templates/     # Page-level layouts (future)
```

**Atoms**: Smallest reusable components
- `v-button.vue` - Button component
- `v-drawer.vue` - Drawer/sidebar component
- `v-horse.vue` - Horse visualization
- `v-select.vue` - Select dropdown
- `v-table.vue` - Table component

**Molecules**: Combinations of atoms
- `horse-table.vue` - Horse data table
- `racing-dashboard-header.vue` - Dashboard header
- `session-results-table.vue` - Results display

**Organisms**: Complex UI sections
- `horse-list-drawer.vue` - Horse selection interface
- `race-track.vue` - Race visualization
- `session-horses-table.vue` - Session horse management

### Composition API

All components use Vue 3's Composition API with `<script setup>` syntax for:
- Better TypeScript support
- Improved code organization
- Enhanced reusability
- Better tree-shaking

### State Management Architecture

**Pinia Stores** (single source of truth):

1. **Horse Store** (`horse.store.ts`)
   - Manages horse data
   - Handles horse generation
   - Maintains unique IDs

2. **Race Store** (`race.store.ts`)
   - Race session management
   - Race animation state
   - Results tracking
   - Program generation

### Plugin System

Modular plugin architecture for extending functionality:

```typescript
src/plugins/
├── index.ts       # Plugin orchestration
├── router.ts      # Vue Router setup
└── pinia.ts       # Pinia store setup
```

Plugins are initialized through a centralized `setupPlugins` function in `main.ts`.

## Application Flow

### Data Flow
```
User Interaction
    ↓
Component Event
    ↓
Store Action
    ↓
State Update
    ↓
Component Re-render
```

### Race Simulation Flow
```
Generate Program
    ↓
Select Horses (10 per race)
    ↓
Start Race Animation
    ↓
Update Horse Positions
    ↓
Calculate Finish Times
    ↓
Record Results
    ↓
Move to Next Race
```

## Key Architectural Decisions

### 1. TypeScript First
All code is written in TypeScript for type safety and better developer experience.

### 2. Component Encapsulation
Each component is self-contained with clear props and emits interfaces.

### 3. Functional Programming
- Arrow functions throughout
- Pure utility functions
- Immutable data patterns where possible

### 4. Conventional Structure
- Kebab-case file naming
- Consistent file extensions (`.vue`, `.ts`, `.spec.ts`)
- Clear separation of concerns

### 5. No Comments Policy
Code is written to be self-documenting through:
- Descriptive function names
- Clear variable names
- Logical code structure

### 6. Emit Convention
Events follow the pattern: `[modifier]:[event-name]`
- Example: `update:model-value`, `click:item`

### 7. Object Parameters
Functions with multiple parameters use object destructuring for clarity:
```typescript
const generateHorse = ({ id, name, color }: { id: number; name: string; color: string })
```

## Performance Considerations

- **Lazy Loading**: Routes are lazy-loaded for optimal initial bundle size
- **Animation**: Uses `requestAnimationFrame` for smooth race animations
- **State Optimization**: Computed properties for derived state
- **Tree Shaking**: ES modules and proper imports for minimal bundle size

## Security Considerations

- No external API calls (self-contained simulation)
- Client-side only application
- No sensitive data storage
- CSP-friendly implementation
