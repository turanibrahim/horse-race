# Development Guide

## Coding Standards

### TypeScript Best Practices

#### 1. Always Use Type Annotations

```typescript
// ✅ Good
const calculateSpeed = (distance: number, time: number): number => {
  return distance / time;
};

// ❌ Bad
const calculateSpeed = (distance, time) => {
  return distance / time;
};
```

#### 2. Use Interfaces for Object Shapes

```typescript
// ✅ Good
interface HorseData {
  id: number;
  name: string;
  color: string;
}

const createHorse = (data: HorseData): Horse => {
  // ...
};

// ❌ Bad
const createHorse = (data: any): any => {
  // ...
};
```

#### 3. Use Type Guards

```typescript
// ✅ Good
const isHorse = (value: unknown): value is Horse => {
  return typeof value === 'object' && 
         value !== null && 
         'id' in value;
};
```

### Vue 3 Best Practices

#### 1. Use Composition API with Script Setup

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

const increment = () => {
  count.value++;
};
</script>
```

#### 2. Define Props and Emits

```vue
<script setup lang="ts">
interface Props {
  modelValue: string;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
```

#### 3. Component Section Order

```vue
<!-- Always follow this order -->
<script setup lang="ts">
// Script content
</script>

<template>
  <!-- Template content -->
</template>

<style>
/* Styles (unscoped by default) */
</style>
```

### Function Conventions

#### 1. Always Use Arrow Functions

```typescript
// ✅ Good
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ Bad
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### 2. Object Parameters for Multiple Arguments

```typescript
// ✅ Good
const createRace = ({ distance, horses }: { 
  distance: number; 
  horses: Horse[];
}): Race => {
  // ...
};

// ❌ Bad
const createRace = (distance: number, horses: Horse[]): Race => {
  // ...
};
```

#### 3. Small, Atomic Functions

```typescript
// ✅ Good - Single responsibility
const generateUniqueId = (): number => {
  return Math.floor(Math.random() * 1000000);
};

const validateHorseName = (name: string): boolean => {
  return name.length > 0 && name.length <= 50;
};

// ❌ Bad - Multiple responsibilities
const setupHorse = (name: string) => {
  const id = Math.floor(Math.random() * 1000000);
  const isValid = name.length > 0 && name.length <= 50;
  const color = getRandomColor();
  // ... too many responsibilities
};
```

### Naming Conventions

#### Files
- Components: `kebab-case.vue` (e.g., `v-button.vue`)
- Pages: `[name].page.vue` (e.g., `racing-dashboard.page.vue`)
- Stores: `[name].store.ts` (e.g., `horse.store.ts`)
- Tests: `[name].spec.ts` (e.g., `v-button.spec.ts`)
- Constants: `[name].constants.ts` (e.g., `horse.constants.ts`)

#### Variables and Functions
```typescript
// Variables: camelCase
const horseCount = 10;
const selectedHorse = null;

// Functions: camelCase (verb-noun pattern)
const calculateSpeed = () => {};
const generateHorses = () => {};
const updatePosition = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_HORSES = 20;
const DEFAULT_DISTANCE = 1200;

// Types/Interfaces: PascalCase
interface Horse {}
type RaceResult = {};
```

### Event Naming Convention

Follow the `[modifier]:[event-name]` pattern:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'click:item', id: number): void;
  (e: 'change:selection', items: Item[]): void;
}>();
</script>
```

### Import Aliases

Always use path aliases instead of relative paths:

```typescript
// ✅ Good
import { useHorseStore } from '@/store/horse.store';
import VButton from '@/components/atoms/v-button.vue';
import type { Horse } from '@/types';

// ❌ Bad
import { useHorseStore } from '../../store/horse.store';
import VButton from '../atoms/v-button.vue';
```

## Code Organization

### Component Structure

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Horse } from '@/types';

// 2. Props and Emits
interface Props {
  horses: Horse[];
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'select:horse', horse: Horse): void;
}>();

// 3. Composables
const router = useRouter();
const horseStore = useHorseStore();

// 4. State
const selectedId = ref<number | null>(null);

// 5. Computed
const selectedHorse = computed(() => 
  props.horses.find(h => h.id === selectedId.value)
);

// 6. Methods
const handleSelect = (horse: Horse) => {
  selectedId.value = horse.id;
  emit('select:horse', horse);
};

// 7. Lifecycle
onMounted(() => {
  // Initialization
});
</script>

<template>
  <!-- Template content -->
</template>

<style>
/* Styles */
</style>
```

### Store Structure

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Horse } from '@/types';

export const useHorseStore = defineStore('horse', () => {
  // 1. State
  const horses = ref<Horse[]>([]);
  const selectedId = ref<number | null>(null);

  // 2. Getters (computed)
  const selectedHorse = computed(() => 
    horses.value.find(h => h.id === selectedId.value)
  );

  // 3. Actions
  const addHorse = (horse: Horse) => {
    horses.value.push(horse);
  };

  const removeHorse = (id: number) => {
    horses.value = horses.value.filter(h => h.id !== id);
  };

  // 4. Return
  return {
    horses,
    selectedId,
    selectedHorse,
    addHorse,
    removeHorse,
  };
});
```

## Styling Guidelines

### Tailwind CSS Usage

```vue
<template>
  <!-- ✅ Use Tailwind utility classes -->
  <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
    <button class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
      Click Me
    </button>
  </div>

  <!-- ❌ Avoid inline styles -->
  <div style="display: flex; padding: 16px;">
    <button style="background: blue; color: white;">
      Click Me
    </button>
  </div>
</template>
```

### Avoid Scoped Styles

Use global styles and utility classes instead:

```vue
<!-- ❌ Avoid scoped styles -->
<style scoped>
.button {
  background: blue;
  color: white;
}
</style>

<!-- ✅ Use Tailwind classes -->
<template>
  <button class="bg-blue-500 text-white">
    Click Me
  </button>
</template>
```

## Self-Documenting Code

### No Comments Policy

Write code that explains itself:

```typescript
// ✅ Good - Self-explanatory
const calculateFinishTime = (horse: Horse, distance: number): number => {
  const baseTime = distance / 100;
  const conditionFactor = 2 - (horse.conditionScore / 100);
  const randomFactor = 0.9 + Math.random() * 0.2;
  return baseTime * conditionFactor * randomFactor;
};

// ❌ Bad - Needs comments
const calc = (h: Horse, d: number): number => {
  // Calculate base time
  const bt = d / 100;
  // Apply condition factor
  const cf = 2 - (h.conditionScore / 100);
  // Add randomness
  const rf = 0.9 + Math.random() * 0.2;
  return bt * cf * rf;
};
```

## Git Workflow

### Conventional Commits

Follow the Conventional Commits specification:

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(race): add pause/resume functionality
fix(horse): correct speed calculation
docs(readme): update installation steps
refactor(store): simplify race state management
test(components): add v-button tests
style(atoms): format v-table component
chore(deps): update vue to 3.5.22
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Adding tests
- `style`: Code formatting
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Branch Naming

```bash
# Feature branches
feature/add-horse-filters
feature/implement-leaderboard

# Bug fixes
fix/race-animation-bug
fix/store-state-issue

# Documentation
docs/update-api-reference
docs/add-architecture-guide
```

## Testing Requirements

### Write Testable Code

```typescript
// ✅ Good - Testable
const calculateSpeed = (distance: number, time: number): number => {
  return distance / time;
};

// ❌ Bad - Hard to test
const component = {
  data() {
    return {
      speed: this.calculateSpeed(),
    };
  },
  methods: {
    calculateSpeed() {
      return this.distance / this.time;
    },
  },
};
```

### Test Coverage Goals

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Performance Best Practices

### 1. Use Computed for Derived State

```typescript
// ✅ Good
const totalScore = computed(() => 
  horses.value.reduce((sum, h) => sum + h.conditionScore, 0)
);

// ❌ Bad
const getTotalScore = () => {
  return horses.value.reduce((sum, h) => sum + h.conditionScore, 0);
};
```

### 2. Lazy Load Routes

```typescript
// ✅ Good
const routes = [
  {
    path: '/',
    component: () => import('@/pages/racing-dashboard.page.vue'),
  },
];

// ❌ Bad
import RacingDashboard from '@/pages/racing-dashboard.page.vue';
const routes = [
  {
    path: '/',
    component: RacingDashboard,
  },
];
```

### 3. Avoid Unnecessary Reactivity

```typescript
// ✅ Good - Use normal variable for non-reactive data
const CONSTANT_VALUE = 100;

// ❌ Bad - Unnecessary reactivity
const constantValue = ref(100);
```

## Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Component uses Composition API with script setup
- [ ] Functions are arrow functions
- [ ] Multiple parameters use object destructuring
- [ ] File naming follows conventions
- [ ] Imports use path aliases
- [ ] Code is self-documenting (no comments needed)
- [ ] Tailwind CSS is used for styling
- [ ] Commit messages follow conventional format
- [ ] Tests are included (when applicable)
- [ ] No ESLint errors
