import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Horse, Race, RaceResult } from '@/types';
import { useHorseStore } from './horse.store';

const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];

const selectRandomHorses = (allHorses: Horse[], count: number): Horse[] => {
  const shuffled = [...allHorses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const initializeRaces = (allHorses: Horse[]): Race[] => {
  return RACE_DISTANCES.map((distance, index) => ({
    round: index + 1,
    distance,
    horses: selectRandomHorses(allHorses, 10),
    results: [],
    isCompleted: false
  }));
};

export const useRaceStore = defineStore('race', () => {
  const horseStore = useHorseStore();
  const races = ref<Race[]>(initializeRaces(horseStore.horses));
  const currentRound = ref<number>(1);

  const calculateFinishTime = (horse: Horse, distance: number): number => {
    const baseTime = distance / 100;
    const randomFactor = 0.9 + Math.random() * 0.2;
    const conditionFactor = 2 - (horse.conditionScore / 100);
    const finishTime = baseTime * conditionFactor * randomFactor;
    
    return Math.round(finishTime * 100) / 100;
  };

  const runRace = (round: number): RaceResult[] => {
    const race = races.value[round - 1];
    
    if (!race) {
      throw new Error(`Race round ${round} not found`);
    }

    if (race.isCompleted) {
      console.warn(`Race round ${round} has already been completed`);
      return race.results;
    }

    const results: RaceResult[] = race.horses.map(horse => ({
      horseId: horse.id,
      horseName: horse.name,
      finishTime: calculateFinishTime(horse, race.distance),
      position: 0
    }));

    results.sort((a, b) => a.finishTime - b.finishTime);
    results.forEach((result, index) => {
      result.position = index + 1;
    });

    race.results = results;
    race.isCompleted = true;

    return results;
  };

  const runAllRaces = (): void => {
    races.value.forEach((race) => {
      if (!race.isCompleted) {
        runRace(race.round);
      }
    });
  };

  const resetRaces = (): void => {
    races.value = initializeRaces(horseStore.horses);
    currentRound.value = 1;
  };

  const getRaceResults = (round: number): RaceResult[] => {
    const race = races.value[round - 1];
    return race?.results || [];
  };

  const getRace = (round: number): Race | undefined => {
    return races.value[round - 1];
  };

  return {
    races,
    currentRound,
    runRace,
    runAllRaces,
    resetRaces,
    getRaceResults,
    getRace
  };
});
