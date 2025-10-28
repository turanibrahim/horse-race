import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Horse } from '@/types';

const HORSE_NAMES = [
  'Thunder', 'Lightning', 'Storm', 'Blaze', 'Shadow',
  'Spirit', 'Comet', 'Star', 'Midnight', 'Phoenix',
  'Apollo', 'Zeus', 'Atlas', 'Titan', 'Hercules',
  'Maverick', 'Rebel', 'Champion', 'Victory', 'Legend',
];

const HORSE_COLORS = [
  '#8B4513', '#000000', '#D2691E', '#808080', '#FFD700',
  '#C19A6B', '#CD853F', '#B8860B', '#A52A2A', '#FFFFFF',
  '#4A2511', '#2F1B0C', '#654321', '#8B7355', '#964B00',
  '#E97451', '#BC8F8F', '#F4A460', '#DEB887', '#D2B48C',
];

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
