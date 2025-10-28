# Component Library

## Component Overview

This application uses the Atomic Design pattern to organize components into three categories: Atoms, Molecules, and Organisms.

## Atoms

Basic building blocks that cannot be broken down further.

### VButton

Button component with customizable appearance and behavior.

**Location**: `src/components/atoms/v-button.vue`

**Props**:
```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'click', event: MouseEvent): void;
}
```

**Usage**:
```vue
<template>
  <VButton 
    variant="primary" 
    size="md"
    @click="handleClick"
  >
    Click Me
  </VButton>
</template>
```

---

### VDrawer

Sliding drawer component for side panels.

**Location**: `src/components/atoms/v-drawer.vue`

**Props**:
```typescript
interface Props {
  modelValue: boolean;
  position?: 'left' | 'right';
  width?: string;
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}
```

**Usage**:
```vue
<template>
  <VDrawer 
    v-model="isOpen" 
    position="right"
    width="400px"
    @close="handleClose"
  >
    <div>Drawer Content</div>
  </VDrawer>
</template>
```

**Slots**:
- `default`: Main drawer content

---

### VHorse

Visual representation of a horse with animation support.

**Location**: `src/components/atoms/v-horse.vue`

**Props**:
```typescript
interface Props {
  horse: Horse;
  position?: number;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}
```

**Usage**:
```vue
<template>
  <VHorse 
    :horse="horse" 
    :position="position"
    size="md"
    :show-name="true"
  />
</template>
```

---

### VSelect

Dropdown select component with search and filtering.

**Location**: `src/components/atoms/v-select.vue`

**Props**:
```typescript
interface Props {
  modelValue: string | number | null;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'update:modelValue', value: string | number | null): void;
  (e: 'change', value: string | number | null): void;
}
```

**Usage**:
```vue
<template>
  <VSelect
    v-model="selectedValue"
    :options="options"
    placeholder="Select an option"
    searchable
    @change="handleChange"
  />
</template>

<script setup lang="ts">
const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
];
</script>
```

---

### VTable

Flexible table component with sorting and styling.

**Location**: `src/components/atoms/v-table.vue`

**Props**:
```typescript
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface Props {
  columns: Column[];
  data: Record<string, any>[];
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'sort', column: string, direction: 'asc' | 'desc'): void;
  (e: 'row:click', row: Record<string, any>): void;
}
```

**Usage**:
```vue
<template>
  <VTable
    :columns="columns"
    :data="tableData"
    striped
    hoverable
    @row:click="handleRowClick"
  />
</template>

<script setup lang="ts">
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'score', label: 'Score', sortable: true },
];

const tableData = [
  { name: 'Horse 1', score: 85 },
  { name: 'Horse 2', score: 92 },
];
</script>
```

**Slots**:
- `cell-{key}`: Custom cell rendering for specific column
- `header-{key}`: Custom header rendering for specific column

---

## Molecules

Combinations of atoms that form simple functional units.

### HorseTable

Table displaying horse information with selection capabilities.

**Location**: `src/components/molecules/horse-table.vue`

**Props**:
```typescript
interface Props {
  horses: Horse[];
  selectedIds?: number[];
  selectable?: boolean;
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'select:horse', horse: Horse): void;
  (e: 'update:selectedIds', ids: number[]): void;
}
```

**Usage**:
```vue
<template>
  <HorseTable
    :horses="horses"
    :selected-ids="selectedIds"
    selectable
    @select:horse="handleSelect"
  />
</template>
```

---

### RacingDashboardHeader

Header component for the racing dashboard with controls.

**Location**: `src/components/molecules/racing-dashboard-header.vue`

**Props**:
```typescript
interface Props {
  title?: string;
  subtitle?: string;
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'generate:program'): void;
  (e: 'start:races'): void;
}
```

**Usage**:
```vue
<template>
  <RacingDashboardHeader
    title="Horse Racing"
    subtitle="Racing Dashboard"
    @generate:program="generateProgram"
    @start:races="startRaces"
  />
</template>
```

**Slots**:
- `actions`: Custom action buttons

---

### SessionResultsTable

Table displaying race session results and rankings.

**Location**: `src/components/molecules/session-results-table.vue`

**Props**:
```typescript
interface Props {
  results: RaceResult[];
  loading?: boolean;
}
```

**Usage**:
```vue
<template>
  <SessionResultsTable
    :results="results"
    :loading="isLoading"
  />
</template>
```

---

## Organisms

Complex components that combine multiple molecules and atoms.

### HorseListDrawer

Drawer component for viewing and selecting horses.

**Location**: `src/components/organisms/horse-list-drawer.vue`

**Props**:
```typescript
interface Props {
  modelValue: boolean;
  horses: Horse[];
  selectedIds?: number[];
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select:horses', horses: Horse[]): void;
  (e: 'add:horse', horse: Partial<Horse>): void;
}
```

**Usage**:
```vue
<template>
  <HorseListDrawer
    v-model="isDrawerOpen"
    :horses="horses"
    :selected-ids="selectedIds"
    @select:horses="handleSelection"
    @add:horse="handleAddHorse"
  />
</template>
```

**Features**:
- Horse list with search/filter
- Multi-select capability
- Add new horse form
- Bulk actions

---

### RaceTrack

Interactive race track with animated horses.

**Location**: `src/components/organisms/race-track.vue`

**Props**:
```typescript
interface Props {
  horses: Horse[];
  positions: Map<number, number>;
  distance: number;
  isRunning?: boolean;
  isPaused?: boolean;
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'toggle:race'): void;
  (e: 'reset:race'): void;
}
```

**Usage**:
```vue
<template>
  <RaceTrack
    :horses="raceHorses"
    :positions="horsePositions"
    :distance="1200"
    :is-running="isRunning"
    :is-paused="isPaused"
    @toggle:race="toggleRace"
    @reset:race="resetRace"
  />
</template>
```

**Features**:
- Real-time horse position updates
- Race controls (play/pause)
- Distance markers
- Finish line visualization

---

### SessionHorsesTable

Table showing horses participating in a session.

**Location**: `src/components/organisms/session-horses-table.vue`

**Props**:
```typescript
interface Props {
  horses: Horse[];
  session: Session;
  editable?: boolean;
}
```

**Emits**:
```typescript
interface Emits {
  (e: 'remove:horse', horseId: number): void;
  (e: 'replace:horse', oldId: number, newHorse: Horse): void;
}
```

**Usage**:
```vue
<template>
  <SessionHorsesTable
    :horses="sessionHorses"
    :session="currentSession"
    editable
    @remove:horse="handleRemove"
    @replace:horse="handleReplace"
  />
</template>
```

**Features**:
- Horse condition display
- Edit/remove capabilities
- Drag-and-drop reordering (if enabled)
- Horse statistics

---

## Composition Guidelines

### Component Communication

**Parent to Child**: Use props
```vue
<VButton :disabled="isLoading" />
```

**Child to Parent**: Use emits
```vue
<VButton @click="handleClick" />
```

**Sibling Components**: Use stores
```typescript
const horseStore = useHorseStore();
const selectedHorse = computed(() => horseStore.selectedHorse);
```

### Slot Usage

Components support slots for flexible content injection:

```vue
<template>
  <VDrawer v-model="isOpen">
    <template #header>
      <h2>Custom Header</h2>
    </template>
    
    <template #default>
      <div>Main Content</div>
    </template>
    
    <template #footer>
      <button>Close</button>
    </template>
  </VDrawer>
</template>
```

### Styling Components

Use Tailwind utility classes:

```vue
<template>
  <div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
    <VButton class="w-full">Full Width Button</VButton>
  </div>
</template>
```

### Responsive Design

Components are responsive by default using Tailwind breakpoints:

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Responsive grid -->
  </div>
</template>
```

## Accessibility

All components follow accessibility best practices:

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly

Example:
```vue
<template>
  <button
    type="button"
    :aria-label="label"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
```

## Testing Components

Example component test:

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VButton from '@/components/atoms/v-button.vue';

describe('VButton', () => {
  it('renders properly', () => {
    const wrapper = mount(VButton, {
      slots: { default: 'Click Me' },
    });
    
    expect(wrapper.text()).toContain('Click Me');
  });

  it('emits click event', async () => {
    const wrapper = mount(VButton);
    await wrapper.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```
