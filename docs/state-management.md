# State Management

## Overview

The application uses **Pinia** for state management, organizing state into domain-specific stores.

## Store Architecture

### Store Structure

```
store/
├── index.ts           # Centralized exports
├── horse.store.ts     # Horse-related state
└── race.store.ts      # Race-related state
```

## Horse Store

**Location**: `src/store/horse.store.ts`

Manages all horse-related data and operations.

### State

```typescript
{
  horses: Horse[];           // All available horses
  usedIds: Set<number>;      // Track used IDs for uniqueness
}
```

### Getters

The store uses computed values for derived state:

```typescript
const selectedHorse = computed(() => 
  horses.value.find(h => h.id === selectedId.value)
);
```

### Actions

#### `addHorse({ name, color })`

Adds a new horse to the collection.

**Parameters**:
```typescript
{
  name: string;
  color: string;
}
```

**Returns**: `Horse`

**Example**:
```typescript
const horseStore = useHorseStore();
const newHorse = horseStore.addHorse({
  name: 'Thunder',
  color: '#8B4513',
});
```

#### `generateUniqueId()`

Generates a unique ID for a horse.

**Returns**: `number`

**Example**:
```typescript
const horseStore = useHorseStore();
const id = horseStore.generateUniqueId();
```

### Usage in Components

```vue
<script setup lang="ts">
import { useHorseStore } from '@/store/horse.store';

const horseStore = useHorseStore();

// Access state
const horses = computed(() => horseStore.horses);

// Call actions
const addNewHorse = () => {
  horseStore.addHorse({
    name: 'Lightning',
    color: '#FFD700',
  });
};
</script>
```

---

## Race Store

**Location**: `src/store/race.store.ts`

Manages race sessions, animations, and results.

### State

```typescript
{
  races: Race[];                        // All races
  currentRound: number;                 // Current race round
  sessions: Session[];                  // Race sessions
  currentSessionId: number | null;      // Active session for viewing
  activeRaceSessionId: number | null;   // Active racing session
  
  // Animation state
  horsePositions: Map<number, number>;  // Horse positions on track
  horseSpeedFactors: Map<number, number>; // Speed multipliers
  finishedHorses: Set<number>;          // Horses that finished
  horseFinishTimes: Map<number, number>; // Finish times
  
  // Timing
  startTime: number;                    // Animation start time
  pausedTime: number;                   // When paused
  totalPausedDuration: number;          // Total pause time
  animationFrameId: number | null;      // RAF ID
}
```

### Getters

#### `currentSession`

Returns the currently viewed session.

**Returns**: `Session | undefined`

#### `activeRaceSession`

Returns the currently racing session.

**Returns**: `Session | undefined`

### Actions

#### Program Management

##### `generateProgram()`

Generates a new racing program with multiple sessions.

Creates sessions for each distance in `RACE_DISTANCES` with 10 randomly selected horses per race.

**Example**:
```typescript
const raceStore = useRaceStore();
raceStore.generateProgram();
```

##### `setCurrentSession(sessionId: number)`

Sets the session being viewed.

**Example**:
```typescript
raceStore.setCurrentSession(1);
```

#### Race Control

##### `startSession()`

Starts the active race session animation.

**Example**:
```typescript
raceStore.startSession();
```

##### `pauseSession()`

Pauses the current race animation.

**Example**:
```typescript
raceStore.pauseSession();
```

##### `resumeSession()`

Resumes a paused race.

**Example**:
```typescript
raceStore.resumeSession();
```

##### `toggleSessionRace()`

Toggles between start/pause/resume states.

**Example**:
```typescript
raceStore.toggleSessionRace();
```

##### `startAllRaces()`

Starts sequential racing of all uncompleted sessions.

**Example**:
```typescript
raceStore.startAllRaces();
```

##### `completeSession(results: RaceResult[])`

Completes a session with final results.

**Parameters**:
```typescript
results: RaceResult[]
```

**Example**:
```typescript
raceStore.completeSession([
  { horseId: 1, horseName: 'Thunder', finishTime: 45.2, position: 1 },
  { horseId: 2, horseName: 'Lightning', finishTime: 46.8, position: 2 },
]);
```

#### Legacy Race Methods

These methods support the older race system:

##### `runRace(round: number)`

Runs a specific race round.

**Returns**: `RaceResult[]`

##### `runAllRaces()`

Runs all races to completion.

##### `resetRaces()`

Resets all race data.

##### `getRaceResults(round: number)`

Gets results for a specific round.

**Returns**: `RaceResult[]`

##### `getRace(round: number)`

Gets race information.

**Returns**: `Race | undefined`

### Usage in Components

```vue
<script setup lang="ts">
import { useRaceStore } from '@/store/race.store';
import { computed } from 'vue';

const raceStore = useRaceStore();

// Access state
const sessions = computed(() => raceStore.sessions);
const currentSession = computed(() => raceStore.currentSession);
const horsePositions = computed(() => raceStore.horsePositions);

// Control races
const handleStartRace = () => {
  raceStore.startAllRaces();
};

const handlePauseRace = () => {
  raceStore.pauseSession();
};

const handleGenerateProgram = () => {
  raceStore.generateProgram();
};
</script>

<template>
  <div>
    <button @click="handleGenerateProgram">Generate Program</button>
    <button @click="handleStartRace">Start Races</button>
    <button @click="handlePauseRace">Pause</button>
    
    <div v-for="session in sessions" :key="session.id">
      {{ session.name }}
    </div>
  </div>
</template>
```

---

## Race Animation Flow

The race animation system uses `requestAnimationFrame` for smooth updates:

### Animation Lifecycle

1. **Initialize**: `initializeAnimation()` sets up positions and speed factors
2. **Start**: `startSession()` begins the animation loop
3. **Update**: `animate()` updates horse positions each frame
4. **Complete**: When all horses finish, `finalizeRaceResults()` is called
5. **Next**: Automatically moves to the next uncompleted session

### Animation State Machine

```
NOT_STARTED
    ↓ startSession()
RUNNING
    ↓ pauseSession()
PAUSED
    ↓ resumeSession()
RUNNING
    ↓ (all horses finish)
COMPLETED
    ↓ (auto-start next)
RUNNING (next session)
```

### Key Animation Functions

```typescript
// Initialize positions and speeds
initializeAnimation(horses: Horse[]): void

// Main animation loop
animate(timestamp: number): void

// Update single horse position
updateHorsePosition({ horse, elapsed }): boolean

// Check if race is complete
checkRaceCompletion(session: Session): boolean

// Finalize and move to next
finalizeRaceResults(session: Session): void
```

---

## Data Flow Patterns

### Reading Data

```vue
<script setup lang="ts">
import { useRaceStore } from '@/store/race.store';
import { computed } from 'vue';

const raceStore = useRaceStore();

// Always use computed for store data
const sessions = computed(() => raceStore.sessions);
const currentSession = computed(() => raceStore.currentSession);
</script>
```

### Modifying Data

```vue
<script setup lang="ts">
import { useRaceStore } from '@/store/race.store';

const raceStore = useRaceStore();

// Call actions directly
const handleAction = () => {
  raceStore.generateProgram();
  raceStore.startSession();
};
</script>
```

### Cross-Store Communication

Stores can access other stores:

```typescript
// Inside race.store.ts
import { useHorseStore } from './horse.store';

export const useRaceStore = defineStore('race', () => {
  const horseStore = useHorseStore();
  
  const generateProgram = () => {
    const horses = horseStore.horses; // Access horse store
    // ... use horses
  };
  
  return { generateProgram };
});
```

---

## Store Best Practices

### 1. Use Composition API Style

```typescript
// ✅ Good - Composition API
export const useHorseStore = defineStore('horse', () => {
  const horses = ref<Horse[]>([]);
  const addHorse = (horse: Horse) => {
    horses.value.push(horse);
  };
  return { horses, addHorse };
});

// ❌ Bad - Options API (avoid)
export const useHorseStore = defineStore('horse', {
  state: () => ({ horses: [] }),
  actions: {
    addHorse(horse) {
      this.horses.push(horse);
    },
  },
});
```

### 2. Always Use Computed in Components

```typescript
// ✅ Good
const horses = computed(() => horseStore.horses);

// ❌ Bad
const horses = horseStore.horses;
```

### 3. Keep Actions Simple

```typescript
// ✅ Good - Simple, focused action
const addHorse = (horse: Horse) => {
  horses.value.push(horse);
};

// ❌ Bad - Too many responsibilities
const addHorseAndStartRace = (horse: Horse) => {
  horses.value.push(horse);
  generateRaces();
  startFirstRace();
  updateLeaderboard();
};
```

### 4. Use TypeScript

```typescript
// ✅ Good - Typed state and actions
const horses = ref<Horse[]>([]);
const addHorse = (horse: Horse): void => {
  horses.value.push(horse);
};

// ❌ Bad - No types
const horses = ref([]);
const addHorse = (horse) => {
  horses.value.push(horse);
};
```

### 5. Organize Returns Clearly

```typescript
return {
  // State
  horses,
  selectedId,
  
  // Getters
  selectedHorse,
  horseCount,
  
  // Actions
  addHorse,
  removeHorse,
  updateHorse,
};
```

---

## Testing Stores

Example store test:

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, it, expect } from 'vitest';
import { useHorseStore } from '@/store/horse.store';

describe('Horse Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('adds a horse', () => {
    const store = useHorseStore();
    const initialCount = store.horses.length;
    
    store.addHorse({ name: 'Thunder', color: '#8B4513' });
    
    expect(store.horses.length).toBe(initialCount + 1);
  });

  it('generates unique IDs', () => {
    const store = useHorseStore();
    const id1 = store.generateUniqueId();
    const id2 = store.generateUniqueId();
    
    expect(id1).not.toBe(id2);
  });
});
```
