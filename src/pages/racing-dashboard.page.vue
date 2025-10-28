<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import RacingDashboardHeader from '@/components/molecules/racing-dashboard-header.vue';
import HorseListDrawer from '@/components/organisms/horse-list-drawer.vue';
import SessionHorsesTable from '@/components/organisms/session-horses-table.vue';
import SessionResultsTable from '@/components/molecules/session-results-table.vue';
import RaceTrack from '@/components/organisms/race-track.vue';
import VSelect, { type SelectOption } from '@/components/atoms/v-select.vue';
import { useRaceStore } from '@/store/race.store';

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
  if (raceStore.activeRaceSessionId) {
    raceStore.toggleSessionRace();
  } else {
    raceStore.startAllRaces();
  }
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

const activeRaceHorses = computed(() => {
  const session = raceStore.activeRaceSession;
  if (!session) return [];
  
  return session.horses;
});

const activeRaceDistance = computed(() => 
  raceStore.activeRaceSession?.distance || 0,
);

const isActiveRaceRunning = computed(() => 
  raceStore.activeRaceSession?.isRunning || false,
);

const isActiveRacePaused = computed(() => 
  raceStore.activeRaceSession?.isPaused || false,
);

const isActiveRaceCompleted = computed(() => 
  raceStore.activeRaceSession?.isCompleted || false,
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
  <div class="p-8 max-w-[1400px] mx-auto">
    <racing-dashboard-header 
      @click:horse-list="handleOpenHorseList"
      @click:generate-program="handleGenerateProgram"
      @click:start-pause-race="handleStartPauseRace"
    />
    
    <header class="mb-12">
      <h1 class="text-[2.5rem] font-bold mb-2">
        Racing Dashboard
      </h1>
      <p class="text-lg text-cool-gray-500">
        Welcome to the Horse Racing Management System
      </p>
    </header>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <p>Loading dashboard...</p>
    </div>

    <div v-else class="flex flex-col gap-8">
      <div v-if="sessionOptions.length === 0" class="py-16 px-8 bg-cool-gray-50 rounded-lg border-2 border-dashed border-cool-gray-200">
        <p class="text-cool-gray-600 text-center text-lg">
          No sessions available. Click "Generate Program" to create sessions.
        </p>
      </div>

      <div v-else class="flex flex-col gap-6">
        <div v-if="activeRaceHorses.length > 0" class="flex flex-col gap-8 mb-8">
          <race-track 
            :horses="activeRaceHorses"
            :distance="activeRaceDistance"
            :is-running="isActiveRaceRunning"
            :is-paused="isActiveRacePaused"
            :is-completed="isActiveRaceCompleted"
          />
        </div>

        <div v-else class="p-8 bg-amber-50 rounded-lg border-2 border-amber-400 mb-6">
          <p class="text-amber-700 text-center text-lg font-medium">
            ⚠️ Click "Start Race" to begin watching races on the track
          </p>
        </div>

        <template v-if="currentSessionHorses.length > 0">
          <div class="bg-white p-6 rounded-lg border border-cool-gray-200">
            <label class="block text-sm font-medium text-cool-gray-700 mb-2">
              Select Session
            </label>
            <v-select
              v-model="selectedSessionId"
              :options="sessionOptions"
              placeholder="Choose a session"
              size="md"
            />
          </div>
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <session-horses-table
              :horses="currentSessionHorses"
              :session-name="currentSessionName"
            />
            
            <session-results-table
              :results="currentSessionResults"
              :session-name="currentSessionName"
            />
          </div>
        </template>
      </div>
    </div>

    <horse-list-drawer v-model="isHorseListDrawerOpen" />
  </div>
</template>
