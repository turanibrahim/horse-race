<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import type { Horse } from '@/types';
import VHorse from '@/components/atoms/v-horse.vue';
import { useRaceStore } from '@/store/race.store';

interface Props {
  horses: Horse[];
  distance: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

const props = defineProps<Props>();

const raceStore = useRaceStore();

const stableLaneAssignment = computed(() => props.horses);

watch(() => props.isRunning, (running) => {
  if (running && !props.isCompleted) {
    raceStore.startSession();
  }
});

watch(() => props.isPaused, (paused) => {
  if (paused) {
    raceStore.pauseSession();
  } else if (props.isRunning && !props.isCompleted) {
    raceStore.resumeSession();
  }
});

onUnmounted(() => {
  raceStore.pauseSession();
});
</script>

<template>
  <div class="race-track-container">
    <div class="race-info">
      <h3 class="text-xl font-bold text-cool-gray-800">
        Race Distance: {{ distance }}m
      </h3>
      <div class="race-status">
        <span
          v-if="isCompleted"
          class="status-badge completed"
        >
          Completed
        </span>
        <span
          v-else-if="isRunning && !isPaused"
          class="status-badge running"
        >
          Running
        </span>
        <span
          v-else-if="isPaused"
          class="status-badge paused"
        >
          Paused
        </span>
        <span
          v-else
          class="status-badge ready"
        >
          Ready
        </span>
      </div>
    </div>

    <div class="race-track">
      <div class="track-background">
        <div
          v-for="i in 10"
          :key="i"
          class="track-lane"
        />
      </div>

      <div class="finish-line" />

      <div
        v-for="(horse, index) in stableLaneAssignment"
        :key="horse.id"
        class="horse-lane"
        :style="{ top: `${index * 10}%` }"
      >
        <div
          class="horse-wrapper"
          :style="{
            left: `${raceStore.horsePositions.get(horse.id) || 0}%`,
          }"
        >
          <v-horse
            :color="horse.color"
            :number="horse.id"
            :is-running="isRunning && !isPaused && !isCompleted"
          />
        </div>
        <div class="horse-info">
          <span class="horse-name">{{ horse.name }}</span>
          <span class="horse-condition">{{ horse.conditionScore }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.race-track-container {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.race-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.race-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.ready {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.running {
  background-color: #dcfce7;
  color: #166534;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.status-badge.paused {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.completed {
  background-color: #e0e7ff;
  color: #4338ca;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.race-track {
  position: relative;
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  overflow: hidden;
}

.track-background {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.track-lane {
  flex: 1;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.02) 50%, 
    rgba(255, 255, 255, 0.05) 100%
  );
}

.track-lane:nth-child(even) {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.04) 50%, 
    rgba(255, 255, 255, 0.08) 100%
  );
}

.finish-line {
  position: absolute;
  right: 2%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: repeating-linear-gradient(
    45deg,
    #ffffff,
    #ffffff 10px,
    #000000 10px,
    #000000 20px
  );
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.horse-lane {
  position: absolute;
  left: 2%;
  right: 2%;
  height: 10%;
  display: flex;
  align-items: center;
  transition: top 0.3s ease;
}

.horse-wrapper {
  position: absolute;
  transition: left 0.1s linear;
  z-index: 10;
}

.horse-info {
  position: absolute;
  left: -120px;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 110px;
}

.horse-name {
  font-weight: 600;
  font-size: 0.75rem;
  color: #1f2937;
  white-space: nowrap;
}

.horse-condition {
  font-size: 0.625rem;
  color: #6b7280;
  font-weight: 500;
}

@media (max-width: 768px) {
  .race-track {
    height: 400px;
  }

  .horse-info {
    left: -100px;
    min-width: 90px;
  }

  .horse-name {
    font-size: 0.675rem;
  }

  .horse-condition {
    font-size: 0.575rem;
  }
}
</style>
