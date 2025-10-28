<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import RacingDashboardHeader from '@/components/molecules/racing-dashboard-header.vue';
import HorseListDrawer from '@/components/organisms/horse-list-drawer.vue';
import SessionHorsesTable from '@/components/organisms/session-horses-table.vue';
import SessionResultsTable from '@/components/molecules/session-results-table.vue';
import RaceTrack from '@/components/organisms/race-track.vue';
import VSelect, { type SelectOption } from '@/components/atoms/v-select.vue';
import { useRaceStore } from '@/store/race.store';
import type { RaceResult } from '@/types';

const raceStore = useRaceStore();

const isLoading = ref(true);
const isHorseListDrawerOpen = ref(false);

const handleOpenHorseList = () => {
  isHorseListDrawerOpen.value = true;
};

const handleGenerateProgram = () => {
  raceStore.generateProgram();
};

const handleStartPauseRace = () => {
  raceStore.toggleSessionRace();
};

const handleRaceComplete = (results: RaceResult[]) => {
  raceStore.completeSession(results);
};

const sessionOptions = computed<SelectOption<number>[]>(() =>
  raceStore.sessions.map(session => ({
    value: session.id,
    label: session.name,
  })),
);

const selectedSessionId = computed({
  get: () => raceStore.currentSessionId ?? undefined,
  set: (value: number | undefined) => {
    if (value !== undefined) {
      raceStore.setCurrentSession(value);
    }
  },
});

const currentSessionHorses = computed(() => {
  const session = raceStore.currentSession;
  if (!session) return [];
  
  return session.horses;
});

const currentSessionResults = computed(() => {
  const session = raceStore.currentSession;
  if (!session) return [];
  
  return session.results;
});

const currentSessionName = computed(() => 
  raceStore.currentSession?.name || 'No Session Selected',
);

const currentSessionDistance = computed(() => 
  raceStore.currentSession?.distance || 0,
);

const isSessionRunning = computed(() => 
  raceStore.currentSession?.isRunning || false,
);

const isSessionPaused = computed(() => 
  raceStore.currentSession?.isPaused || false,
);

const isSessionCompleted = computed(() => 
  raceStore.currentSession?.isCompleted || false,
);

onMounted(async () => {
  try {
    isLoading.value = false;
  } catch {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="racing-dashboard">
    <racing-dashboard-header 
      @click:horse-list="handleOpenHorseList"
      @click:generate-program="handleGenerateProgram"
      @click:start-pause-race="handleStartPauseRace"
    />
    
    <header class="dashboard-header">
      <h1>Racing Dashboard</h1>
      <p>Welcome to the Horse Racing Management System</p>
    </header>

    <div v-if="isLoading" class="loading-state">
      <p>Loading dashboard...</p>
    </div>

    <div v-else class="dashboard-content">
      <div v-if="sessionOptions.length === 0" class="no-sessions-message">
        <p class="text-cool-gray-600 text-center text-lg">
          No sessions available. Click "Generate Program" to create sessions.
        </p>
      </div>

      <div v-else class="sessions-container">
        <div class="session-selector mb-6">
          <label class="block text-sm font-medium text-cool-gray-700 mb-2">
            Select Session
          </label>
          <v-select
            v-model="selectedSessionId"
            :options="sessionOptions"
            placeholder="Choose a session"
            size="md"
            class="max-w-md"
          />
        </div>

        <div v-if="currentSessionHorses.length > 0" class="race-content">
          <race-track 
            :horses="currentSessionHorses"
            :distance="currentSessionDistance"
            :is-running="isSessionRunning"
            :is-paused="isSessionPaused"
            :is-completed="isSessionCompleted"
            @race:complete="handleRaceComplete"
          />

          <div class="tables-grid">
            <session-horses-table
              :horses="currentSessionHorses"
              :session-name="currentSessionName"
            />
            
            <session-results-table
              :results="currentSessionResults"
              :session-name="currentSessionName"
            />
          </div>
        </div>
      </div>
    </div>

    <horse-list-drawer v-model="isHorseListDrawerOpen" />
  </div>
</template>

<style>
.racing-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  font-size: 1.125rem;
  color: #6b7280;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.no-sessions-message {
  padding: 4rem 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 2px dashed #e5e7eb;
}

.sessions-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.session-selector {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.race-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .tables-grid {
    grid-template-columns: 1fr;
  }
}
</style>
