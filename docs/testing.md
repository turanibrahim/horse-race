# Testing Guide

## Testing Stack

- **Vitest**: Unit and integration testing framework
- **@vue/test-utils**: Vue component testing utilities
- **Happy DOM**: Lightweight DOM implementation
- **Playwright**: End-to-end testing
- **@vitest/ui**: Interactive test UI
- **@vitest/coverage-v8**: Code coverage reporting

## Running Tests

### Unit Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage

# View coverage in UI
npm run test:coverage:ui
```

### E2E Tests

```bash
# Run Playwright tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run with visible browser
npm run test:e2e:headed

# Show test report
npm run test:e2e:report
```

## Test File Structure

### Location

Tests are co-located with source files:

```
src/
├── components/
│   ├── atoms/
│   │   ├── v-button.vue
│   │   └── __tests__/
│   │       └── v-button.spec.ts
│   ├── molecules/
│   │   ├── horse-table.vue
│   │   └── __tests__/
│   │       └── horse-table.spec.ts
│   └── organisms/
│       ├── race-track.vue
│       └── __tests__/
│           └── race-track.spec.ts
├── store/
│   ├── horse.store.ts
│   └── __tests__/
│       └── horse.store.spec.ts
└── __tests__/
    └── setup.ts
```

### Naming Convention

- Test files: `[component-name].spec.ts`
- Test folders: `__tests__/`

## Writing Unit Tests

### Component Tests

#### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VButton from '@/components/atoms/v-button.vue';

describe('VButton', () => {
  it('renders properly', () => {
    const wrapper = mount(VButton, {
      slots: {
        default: 'Click Me',
      },
    });
    
    expect(wrapper.text()).toContain('Click Me');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(VButton);
    await wrapper.trigger('click');
    
    expect(wrapper.emitted()).toHaveProperty('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(VButton, {
      props: {
        disabled: true,
      },
    });
    
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });
});
```

#### Testing with Props

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VSelect from '@/components/atoms/v-select.vue';

describe('VSelect', () => {
  const options = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
  ];

  it('renders all options', () => {
    const wrapper = mount(VSelect, {
      props: {
        options,
        modelValue: null,
      },
    });
    
    const renderedOptions = wrapper.findAll('option');
    expect(renderedOptions).toHaveLength(options.length);
  });

  it('emits update:modelValue on selection', async () => {
    const wrapper = mount(VSelect, {
      props: {
        options,
        modelValue: null,
      },
    });
    
    await wrapper.find('select').setValue(1);
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
  });
});
```

#### Testing with Slots

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VDrawer from '@/components/atoms/v-drawer.vue';

describe('VDrawer', () => {
  it('renders slot content', () => {
    const wrapper = mount(VDrawer, {
      props: {
        modelValue: true,
      },
      slots: {
        default: '<div class="test-content">Drawer Content</div>',
      },
    });
    
    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.text()).toContain('Drawer Content');
  });

  it('shows drawer when modelValue is true', () => {
    const wrapper = mount(VDrawer, {
      props: {
        modelValue: true,
      },
    });
    
    expect(wrapper.find('.drawer').isVisible()).toBe(true);
  });

  it('hides drawer when modelValue is false', () => {
    const wrapper = mount(VDrawer, {
      props: {
        modelValue: false,
      },
    });
    
    expect(wrapper.find('.drawer').exists()).toBe(false);
  });
});
```

### Store Tests

#### Testing Pinia Stores

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, it, expect } from 'vitest';
import { useHorseStore } from '@/store/horse.store';
import type { Horse } from '@/types';

describe('Horse Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
  });

  it('initializes with horses', () => {
    const store = useHorseStore();
    expect(store.horses).toBeDefined();
    expect(Array.isArray(store.horses)).toBe(true);
  });

  it('adds a horse', () => {
    const store = useHorseStore();
    const initialCount = store.horses.length;
    
    const newHorse = store.addHorse({
      name: 'Thunder',
      color: '#8B4513',
    });
    
    expect(store.horses.length).toBe(initialCount + 1);
    expect(newHorse.name).toBe('Thunder');
    expect(newHorse.color).toBe('#8B4513');
  });

  it('generates unique IDs', () => {
    const store = useHorseStore();
    const id1 = store.generateUniqueId();
    const id2 = store.generateUniqueId();
    
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('number');
    expect(typeof id2).toBe('number');
  });
});
```

#### Testing Store Actions

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, it, expect } from 'vitest';
import { useRaceStore } from '@/store/race.store';
import { useHorseStore } from '@/store/horse.store';

describe('Race Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('generates a program', () => {
    const raceStore = useRaceStore();
    const initialSessionCount = raceStore.sessions.length;
    
    raceStore.generateProgram();
    
    expect(raceStore.sessions.length).toBeGreaterThan(initialSessionCount);
  });

  it('sets current session', () => {
    const raceStore = useRaceStore();
    raceStore.generateProgram();
    
    const firstSession = raceStore.sessions[0];
    if (firstSession) {
      raceStore.setCurrentSession(firstSession.id);
      expect(raceStore.currentSessionId).toBe(firstSession.id);
    }
  });

  it('starts a session', () => {
    const raceStore = useRaceStore();
    raceStore.generateProgram();
    
    const firstSession = raceStore.sessions[0];
    if (firstSession) {
      raceStore.activeRaceSessionId = firstSession.id;
      raceStore.startSession();
      
      expect(firstSession.isRunning).toBe(true);
      expect(firstSession.isPaused).toBe(false);
    }
  });
});
```

### Utility Function Tests

```typescript
import { describe, it, expect } from 'vitest';

const calculateSpeed = (distance: number, time: number): number => {
  return distance / time;
};

describe('calculateSpeed', () => {
  it('calculates speed correctly', () => {
    const speed = calculateSpeed(100, 10);
    expect(speed).toBe(10);
  });

  it('handles decimal values', () => {
    const speed = calculateSpeed(150, 7.5);
    expect(speed).toBe(20);
  });

  it('returns Infinity for zero time', () => {
    const speed = calculateSpeed(100, 0);
    expect(speed).toBe(Infinity);
  });
});
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good - Tests behavior
it('displays error message when validation fails', async () => {
  const wrapper = mount(Form);
  await wrapper.find('input').setValue('');
  await wrapper.find('form').trigger('submit');
  
  expect(wrapper.text()).toContain('This field is required');
});

// ❌ Bad - Tests implementation
it('calls validateInput method', () => {
  const wrapper = mount(Form);
  const spy = vi.spyOn(wrapper.vm, 'validateInput');
  wrapper.vm.handleSubmit();
  
  expect(spy).toHaveBeenCalled();
});
```

### 2. Keep Tests Isolated

```typescript
// ✅ Good - Each test is independent
describe('VButton', () => {
  it('renders with primary variant', () => {
    const wrapper = mount(VButton, {
      props: { variant: 'primary' },
    });
    expect(wrapper.classes()).toContain('btn-primary');
  });

  it('renders with secondary variant', () => {
    const wrapper = mount(VButton, {
      props: { variant: 'secondary' },
    });
    expect(wrapper.classes()).toContain('btn-secondary');
  });
});

// ❌ Bad - Tests depend on each other
describe('VButton', () => {
  let wrapper;
  
  it('renders with primary variant', () => {
    wrapper = mount(VButton, {
      props: { variant: 'primary' },
    });
    expect(wrapper.classes()).toContain('btn-primary');
  });

  it('can change to secondary variant', async () => {
    await wrapper.setProps({ variant: 'secondary' });
    expect(wrapper.classes()).toContain('btn-secondary');
  });
});
```

### 3. Use Descriptive Test Names

```typescript
// ✅ Good - Clear what is being tested
it('emits update:modelValue with new value when option is selected', () => {
  // ...
});

it('disables the button when loading prop is true', () => {
  // ...
});

// ❌ Bad - Unclear test purpose
it('works correctly', () => {
  // ...
});

it('test 1', () => {
  // ...
});
```

### 4. Test Edge Cases

```typescript
describe('calculateFinishTime', () => {
  it('calculates finish time for normal conditions', () => {
    const time = calculateFinishTime(horse, 1200);
    expect(time).toBeGreaterThan(0);
  });

  it('handles zero distance', () => {
    const time = calculateFinishTime(horse, 0);
    expect(time).toBe(0);
  });

  it('handles maximum condition score', () => {
    const horse = { ...baseHorse, conditionScore: 100 };
    const time = calculateFinishTime(horse, 1200);
    expect(time).toBeLessThan(normalTime);
  });

  it('handles minimum condition score', () => {
    const horse = { ...baseHorse, conditionScore: 1 };
    const time = calculateFinishTime(horse, 1200);
    expect(time).toBeGreaterThan(normalTime);
  });
});
```

## E2E Testing

### Playwright Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Racing Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays racing dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Horse Racing');
  });

  test('generates a program', async ({ page }) => {
    await page.click('button:has-text("Generate Program")');
    
    await expect(page.locator('.session-card')).toHaveCount(6);
  });

  test('starts a race', async ({ page }) => {
    await page.click('button:has-text("Generate Program")');
    await page.click('button:has-text("Start All Races")');
    
    await expect(page.locator('.race-track')).toBeVisible();
    await expect(page.locator('.horse')).toHaveCount(10);
  });

  test('displays race results', async ({ page }) => {
    await page.click('button:has-text("Generate Program")');
    await page.click('button:has-text("Start All Races")');
    
    // Wait for race to complete
    await page.waitForSelector('.results-table', { timeout: 60000 });
    
    const results = page.locator('.results-table tbody tr');
    await expect(results).toHaveCount(10);
  });
});
```

### E2E Testing Best Practices

1. **Use data-testid attributes for stable selectors**:
```vue
<template>
  <button data-testid="start-race-btn">Start Race</button>
</template>
```

```typescript
await page.click('[data-testid="start-race-btn"]');
```

2. **Wait for navigation and state changes**:
```typescript
await page.click('button');
await page.waitForLoadState('networkidle');
```

3. **Test user workflows, not implementation**:
```typescript
// ✅ Good - Tests user workflow
test('user can create and run a race', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Generate Program');
  await page.click('text=Start Race');
  await page.waitForSelector('.race-results');
  expect(await page.textContent('.winner')).toBeTruthy();
});
```

## Coverage Requirements

Target coverage levels (configured in `vitest.config.ts`):

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Viewing Coverage

```bash
# Generate HTML coverage report
npm run test:coverage

# Open coverage/index.html in browser
open coverage/index.html
```

### Coverage Exclusions

Configured in `vitest.config.ts`:

- `node_modules/`
- `src/__tests__/`
- `**/*.spec.ts`
- `**/*.config.*`
- `**/dist/**`
- `**/*.d.ts`
- `e2e/`

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run unit tests
        run: npm run test:run
        
      - name: Run coverage
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        
      - name: Run E2E tests
        run: npm run test:e2e
```

## Debugging Tests

### Debug Unit Tests in VSCode

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest Tests",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug E2E Tests

```bash
# Run Playwright in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/racing-dashboard.spec.ts --debug
```

## Mock Data for Testing

```typescript
// test-utils.ts
import type { Horse, Session } from '@/types';

export const createMockHorse = (overrides?: Partial<Horse>): Horse => ({
  id: 1,
  name: 'Test Horse',
  color: '#8B4513',
  conditionScore: 85,
  ...overrides,
});

export const createMockSession = (overrides?: Partial<Session>): Session => ({
  id: 1,
  name: 'Test Race - 1200m',
  distance: 1200,
  horses: [createMockHorse()],
  results: [],
  isCompleted: false,
  isRunning: false,
  isPaused: false,
  createdAt: new Date(),
  ...overrides,
});
```

Usage:

```typescript
import { createMockHorse, createMockSession } from './test-utils';

it('displays horse information', () => {
  const horse = createMockHorse({ name: 'Thunder' });
  const wrapper = mount(HorseCard, {
    props: { horse },
  });
  
  expect(wrapper.text()).toContain('Thunder');
});
```
