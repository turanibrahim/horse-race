import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Horse } from '@/types';
import { HORSE_COLORS, HORSE_NAMES } from '@/constants';

const generateHorse = ({ id, name, color }: { id: number; name: string; color: string }): Horse => {
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
  const usedIds = new Set<number>();
  const availableColors = [...HORSE_COLORS];

  const generateUniqueId = (): number => {
    let id: number;
    do {
      id = Math.floor(Math.random() * 1000000);
    } while (usedIds.has(id));
    usedIds.add(id);
    return id;
  };

  for (let i = 0; i < count; i++) {
    let name = HORSE_NAMES[i % HORSE_NAMES.length]!;
    if (usedNames.has(name)) {
      name = `${name} ${Math.floor(i / HORSE_NAMES.length) + 1}`;
    }
    usedNames.add(name);

    const colorIndex = Math.floor(Math.random() * availableColors.length);
    const color = availableColors[colorIndex]!;
    availableColors.splice(colorIndex, 1);

    horses.push(generateHorse({ id: generateUniqueId(), name, color }));
  }

  return horses;
};

export const useHorseStore = defineStore('horse', () => {
  const horses = ref<Horse[]>(generateHorses(20));
  const usedIds = ref<Set<number>>(new Set(horses.value.map(h => h.id)));

  const generateUniqueId = (): number => {
    let id: number;
    do {
      id = Math.floor(Math.random() * 1000000);
    } while (usedIds.value.has(id));
    
    usedIds.value.add(id);
    return id;
  };

  const addHorse = ({ name, color }: { name: string; color: string }): Horse => {
    const id = generateUniqueId();
    const horse = generateHorse({ id, name, color });
    horses.value.push(horse);
    return horse;
  };

  return {
    horses,
    addHorse,
    generateUniqueId,
  };
});
