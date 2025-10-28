<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
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

const HORSE_WIDTH = 50;
const trackRef = ref<HTMLElement | null>(null);
const trackWidth = ref<number>(0);

const calculateHorsePosition = (horseId: number): number => {
  const positionPercentage = raceStore.horsePositions.get(horseId) || 0;
  
  if (!trackWidth.value) return 0;
  
  const effectiveTrackLength = trackWidth.value - HORSE_WIDTH;
  const positionInPixels = (positionPercentage / 100) * effectiveTrackLength;
  
  return positionInPixels;
};

const isHorseRunning = (horseId: number): boolean => {
  if (props.isCompleted || props.isPaused || !props.isRunning) return false;
  
  const hasFinished = raceStore.finishedHorses.has(horseId);
  return !hasFinished;
};

const updateTrackWidth = () => {
  if (trackRef.value) {
    trackWidth.value = trackRef.value.offsetWidth;
  }
};

onMounted(() => {
  updateTrackWidth();
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateTrackWidth);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateTrackWidth);
  }
});
</script>

<template>
  <div class="bg-white rounded-lg border border-cool-gray-200 p-6 mb-8">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-cool-gray-800">
        Race Distance: {{ distance }}m
      </h3>
      <div class="flex items-center">
        <span
          v-if="isCompleted"
          class="px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide bg-indigo-100 text-indigo-700"
        >
          Completed
        </span>
        <span
          v-else-if="isRunning && !isPaused"
          class="px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide bg-green-100 text-green-700 animate-pulse-opacity"
        >
          Running
        </span>
        <span
          v-else-if="isPaused"
          class="px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide bg-amber-100 text-amber-800"
        >
          Paused
        </span>
        <span
          v-else
          class="px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide bg-blue-100 text-blue-800"
        >
          Ready
        </span>
      </div>
    </div>

    <div ref="trackRef" class="relative w-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden h-[500px]">
      <div class="absolute inset-0 flex flex-col">
        <div
          v-for="i in 10"
          :key="i"
          class="flex-1 border-b-2 border-white/20"
          :class="i % 2 === 0 ? 'bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-white/[0.08]' : 'bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-white/[0.05]'"
        />
      </div>

      <div class="absolute right-0 top-0 bottom-0 w-1 bg-[repeating-linear-gradient(45deg,#ffffff,#ffffff_10px,#000000_10px,#000000_20px)] shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

      <div
        v-for="(horse, index) in stableLaneAssignment"
        :key="horse.id"
        class="absolute h-[10%] flex items-center transition-[top] duration-300"
        :style="{ top: `${index * 10}%` }"
      >
        <div
          class="absolute transition-[left] duration-100 z-10"
          :style="{
            left: `${calculateHorsePosition(horse.id)}px`,
          }"
        >
          <v-horse
            :color="horse.color"
            :is-running="isHorseRunning(horse.id)"
          />
        </div>
        <div class="absolute left-2 text-white font-semibold text-sm opacity-50">
          {{ horse.name }}
        </div>
      </div>
    </div>
  </div>
</template>
