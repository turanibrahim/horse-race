# API Reference

## Type Definitions

### Horse

Represents a horse in the racing system.

```typescript
interface Horse {
  id: number;
  name: string;
  color: string;
  conditionScore: number;
}
```

**Properties**:

- `id`: Unique identifier for the horse
- `name`: Horse's name (max 50 characters)
- `color`: Hex color code for visual representation (e.g., `#8B4513`)
- `conditionScore`: Fitness level from 1-100 (higher = faster)

**Example**:
```typescript
const horse: Horse = {
  id: 12345,
  name: 'Thunder',
  color: '#8B4513',
  conditionScore: 85,
};
```

---

### RaceResult

Race result for a single horse.

```typescript
interface RaceResult {
  horseId: number;
  horseName: string;
  finishTime: number;
  position: number;
}
```

**Properties**:

- `horseId`: ID of the horse
- `horseName`: Name of the horse
- `finishTime`: Time to complete the race in seconds
- `position`: Final position (1st, 2nd, 3rd, etc.)

**Example**:
```typescript
const result: RaceResult = {
  horseId: 12345,
  horseName: 'Thunder',
  finishTime: 45.32,
  position: 1,
};
```

---

### Race

Legacy race object (used in older race system).

```typescript
interface Race {
  round: number;
  distance: number;
  horses: Horse[];
  results: RaceResult[];
  isCompleted: boolean;
  isRunning: boolean;
  isPaused: boolean;
}
```

**Properties**:

- `round`: Race round number
- `distance`: Race distance in meters
- `horses`: Horses participating in this race
- `results`: Race results (empty until completed)
- `isCompleted`: Whether the race has finished
- `isRunning`: Whether the race is currently running
- `isPaused`: Whether the race is paused

---

### Session

Race session object (current system).

```typescript
interface Session {
  id: number;
  name: string;
  distance: number;
  horses: Horse[];
  results: RaceResult[];
  isCompleted: boolean;
  isRunning: boolean;
  isPaused: boolean;
  createdAt: Date;
}
```

**Properties**:

- `id`: Unique session identifier
- `name`: Display name (e.g., "Race 1 - 1200m")
- `distance`: Race distance in meters
- `horses`: 10 horses participating
- `results`: Race results (empty until completed)
- `isCompleted`: Whether the session has finished
- `isRunning`: Whether the session is currently running
- `isPaused`: Whether the session is paused
- `createdAt`: Session creation timestamp

**Example**:
```typescript
const session: Session = {
  id: 1,
  name: 'Race 1 - 1200m',
  distance: 1200,
  horses: [horse1, horse2, ...],
  results: [],
  isCompleted: false,
  isRunning: false,
  isPaused: false,
  createdAt: new Date(),
};
```

---

## Constants

### Horse Constants

**Location**: `src/constants/horse.constants.ts`

#### HORSE_NAMES

```typescript
const HORSE_NAMES: string[];
```

Array of 20 predefined horse names:
- Thunder, Lightning, Storm, Blaze, Shadow
- Spirit, Comet, Star, Midnight, Phoenix
- Apollo, Zeus, Atlas, Titan, Hercules
- Maverick, Rebel, Champion, Victory, Legend

#### HORSE_COLORS

```typescript
const HORSE_COLORS: string[];
```

Array of 20 hex color codes for horse visualization:
- Browns: `#8B4513`, `#A52A2A`, `#964B00`
- Grays: `#808080`, `#D3D3D3`
- Golds: `#FFD700`, `#B8860B`
- Others: `#000000`, `#FFFFFF`, etc.

---

### Race Constants

**Location**: `src/constants/race.constants.ts`

#### RACE_DISTANCES

```typescript
const RACE_DISTANCES: number[] = [1200, 1400, 1600, 1800, 2000, 2200];
```

Standard race distances in meters (6 races per program).

#### TRACK_LENGTH

```typescript
const TRACK_LENGTH: number = 100;
```

Normalized track length for animation (0-100 scale).

#### BASE_SPEED

```typescript
const BASE_SPEED: number = 1.5;
```

Base speed multiplier for race animation.

---

## Utility Functions

### Horse Generation

#### generateHorse

```typescript
const generateHorse = ({ 
  id, 
  name, 
  color 
}: { 
  id: number; 
  name: string; 
  color: string;
}): Horse
```

Creates a horse with a random condition score.

**Parameters**:
- `id`: Unique horse ID
- `name`: Horse name
- `color`: Hex color code

**Returns**: Complete `Horse` object

**Example**:
```typescript
const horse = generateHorse({
  id: 1,
  name: 'Thunder',
  color: '#8B4513',
});
```

---

### Race Calculations

#### calculateSpeedFactor

```typescript
const calculateSpeedFactor = (horse: Horse): number
```

Calculates speed multiplier based on horse condition.

**Parameters**:
- `horse`: Horse object

**Returns**: Speed factor (0.68 - 1.34)

**Algorithm**:
```typescript
baseVariation = 0.85 + random(0.3)
conditionFactor = conditionScore / 100
speedFactor = baseVariation * (0.8 + conditionFactor * 0.4)
```

---

#### calculateFinishTime

```typescript
const calculateFinishTime = (horse: Horse, distance: number): number
```

Calculates expected finish time for a horse.

**Parameters**:
- `horse`: Horse object
- `distance`: Race distance in meters

**Returns**: Finish time in seconds

**Algorithm**:
```typescript
baseTime = distance / 100
conditionFactor = 2 - (conditionScore / 100)
randomFactor = 0.9 + random(0.2)
finishTime = baseTime * conditionFactor * randomFactor
```

**Example**:
```typescript
const finishTime = calculateFinishTime(horse, 1200);
// Returns: ~42-50 seconds for 1200m race
```

---

### Selection Functions

#### selectRandomHorses

```typescript
const selectRandomHorses = (
  allHorses: Horse[], 
  count: number
): Horse[]
```

Randomly selects horses from the available pool.

**Parameters**:
- `allHorses`: Array of all horses
- `count`: Number of horses to select

**Returns**: Array of selected horses

**Example**:
```typescript
const raceHorses = selectRandomHorses(allHorses, 10);
```

---

### Result Processing

#### createRaceResults

```typescript
const createRaceResults = (
  horses: Horse[], 
  finishTimes: Map<number, number>
): RaceResult[]
```

Creates sorted race results from finish times.

**Parameters**:
- `horses`: Array of horses in the race
- `finishTimes`: Map of horse IDs to finish times

**Returns**: Sorted array of `RaceResult` objects

**Example**:
```typescript
const finishTimes = new Map([
  [1, 45.32],
  [2, 46.18],
  [3, 44.91],
]);

const results = createRaceResults(horses, finishTimes);
// Results sorted by finish time (position assigned)
```

---

## Router Configuration

### Routes

```typescript
const routes = [
  {
    path: '/',
    name: 'racing-dashboard',
    component: () => import('@/pages/racing-dashboard.page.vue'),
  },
  {
    path: '/theme',
    name: 'theme',
    component: () => import('@/pages/theme-preview.page.vue'),
  },
];
```

### Navigation

```typescript
import { useRouter } from 'vue-router';

const router = useRouter();

// Navigate to racing dashboard
router.push('/');
router.push({ name: 'racing-dashboard' });

// Navigate to theme preview
router.push('/theme');
router.push({ name: 'theme' });
```

---

## Plugin System

### setupPlugins

**Location**: `src/plugins/index.ts`

```typescript
const setupPlugins = (app: App): void
```

Initializes all Vue plugins.

**Parameters**:
- `app`: Vue application instance

**Plugins Loaded**:
1. Pinia (state management)
2. Vue Router

**Example**:
```typescript
import { createApp } from 'vue';
import { setupPlugins } from '@/plugins';
import App from '@/app.vue';

const app = createApp(App);
setupPlugins(app);
app.mount('#app');
```

---

## Environment Variables

### Vite Environment

Accessible via `import.meta.env`:

```typescript
// Base URL for router
const baseUrl = import.meta.env.BASE_URL;

// Environment mode
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Custom env variables (prefix with VITE_)
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Path Aliases

### @ Alias

Points to `src/` directory:

```typescript
// Instead of:
import Component from '../../components/atoms/v-button.vue';

// Use:
import Component from '@/components/atoms/v-button.vue';
```

### Available Aliases

- `@` → `src/`
- `@/components` → `src/components/`
- `@/store` → `src/store/`
- `@/types` → `src/types/`
- `@/constants` → `src/constants/`
- `@/pages` → `src/pages/`
- `@/plugins` → `src/plugins/`

---

## Browser APIs Used

### requestAnimationFrame

Used for race animation:

```typescript
const animate = (timestamp: number) => {
  // Animation logic
  animationFrameId.value = requestAnimationFrame(animate);
};
```

### Performance API

Used for precise timing:

```typescript
const startTime = performance.now();
const elapsed = performance.now() - startTime;
```

### Local Storage

Not currently used (all state is in-memory).

---

## Type Guards

### isHorse

```typescript
const isHorse = (value: unknown): value is Horse => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'color' in value &&
    'conditionScore' in value
  );
};
```

### isSession

```typescript
const isSession = (value: unknown): value is Session => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'distance' in value &&
    'horses' in value
  );
};
```

---

## Error Handling

### Validation Errors

```typescript
// Horse name validation
if (name.length === 0 || name.length > 50) {
  throw new Error('Horse name must be between 1 and 50 characters');
}

// Race round validation
if (!race) {
  throw new Error(`Race round ${round} not found`);
}

// Race state validation
if (race.isCompleted) {
  throw new Error(`Race round ${round} has already been completed`);
}
```
