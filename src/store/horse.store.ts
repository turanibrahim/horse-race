import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Horse } from '@/types';
import { HORSE_COLORS, HORSE_NAMES } from '@/constants';

const generateHorse = (id: number, name: string): Horse => {
  const color = HORSE_COLORS[Math.floor(Math.random() * HORSE_COLORS.length)]!;
  const conditionScore = Math.floor(Math.random() * 100) + 1;

  return {
    id,
    name,
    color,
    conditionScore,
  };
};

const generateHorses = (count: number): Horse[] => {
  const horses: Horse[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let name = HORSE_NAMES[i % HORSE_NAMES.length]!;
    if (usedNames.has(name)) {
      name = `${name} ${Math.floor(i / HORSE_NAMES.length) + 1}`;
    }
    usedNames.add(name);

    horses.push(generateHorse(i + 1, name));
  }

  return horses;
};

export const useHorseStore = defineStore('horse', () => {
  const horses = ref<Horse[]>(generateHorses(20));

  return {
    horses,
  };
});
