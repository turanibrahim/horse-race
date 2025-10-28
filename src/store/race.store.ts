import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Horse, Race, RaceResult, Session } from '@/types';
import { useHorseStore } from '@/store/horse.store';

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
    isCompleted: false,
    isRunning: false,
    isPaused: false,
  }));
};

export const useRaceStore = defineStore('race', () => {
  const horseStore = useHorseStore();
  const races = ref<Race[]>([]);
  const currentRound = ref<number>(1);
  const sessions = ref<Session[]>([]);
  const currentSessionId = ref<number | null>(null);

  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value),
  );

  const generateProgram = () => {
    const newSessions: Session[] = [];

    RACE_DISTANCES.forEach((distance, index) => {
      const sessionId = sessions.value.length + index + 1;
      const sessionHorses = selectRandomHorses(horseStore.horses, 10);
      
      newSessions.push({
        id: sessionId,
        name: `Race ${sessionId} - ${distance}m`,
        distance,
        horses: sessionHorses,
        results: [],
        isCompleted: false,
        isRunning: false,
        isPaused: false,
        createdAt: new Date(),
      });
    });

    sessions.value = [...sessions.value, ...newSessions];
    
    if (!currentSessionId.value && newSessions.length > 0) {
      currentSessionId.value = newSessions[0]!.id;
    }
  };

  const setCurrentSession = (sessionId: number) => {
    currentSessionId.value = sessionId;
  };

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
      // Race has already been completed
      return race.results;
    }

    const results: RaceResult[] = race.horses.map(horse => ({
      horseId: horse.id,
      horseName: horse.name,
      finishTime: calculateFinishTime(horse, race.distance),
      position: 0,
    }));

    results.sort((a, b) => a.finishTime - b.finishTime);
    results.forEach((result, index) => {
      result.position = index + 1;
    });

    race.results = results;
    race.isCompleted = true;
    race.isRunning = false;
    race.isPaused = false;

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

  const startRace = (round: number): void => {
    const race = races.value[round - 1];
    
    if (!race) {
      throw new Error(`Race round ${round} not found`);
    }

    if (race.isCompleted) {
      throw new Error(`Race round ${round} has already been completed`);
    }

    race.isRunning = true;
    race.isPaused = false;
  };

  const pauseRace = (round: number): void => {
    const race = races.value[round - 1];
    
    if (!race) {
      throw new Error(`Race round ${round} not found`);
    }

    if (!race.isRunning) {
      throw new Error(`Race round ${round} is not running`);
    }

    if (race.isCompleted) {
      throw new Error(`Race round ${round} has already been completed`);
    }

    race.isPaused = true;
  };

  const resumeRace = (round: number): void => {
    const race = races.value[round - 1];
    
    if (!race) {
      throw new Error(`Race round ${round} not found`);
    }

    if (!race.isRunning) {
      throw new Error(`Race round ${round} is not running`);
    }

    race.isPaused = false;
  };

  const startSession = () => {
    const session = currentSession.value;
    if (!session) return;

    if (session.isCompleted) return;

    session.isRunning = true;
    session.isPaused = false;
  };

  const pauseSession = () => {
    const session = currentSession.value;
    if (!session) return;

    if (!session.isRunning) return;

    session.isPaused = true;
  };

  const resumeSession = () => {
    const session = currentSession.value;
    if (!session) return;

    if (!session.isRunning) return;

    session.isPaused = false;
  };

  const toggleSessionRace = () => {
    const session = currentSession.value;
    if (!session) return;

    if (session.isCompleted) return;

    if (!session.isRunning) {
      startSession();
    } else if (session.isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  const completeSession = (results: RaceResult[]) => {
    const session = currentSession.value;
    if (!session) return;

    session.results = results;
    session.isCompleted = true;
    session.isRunning = false;
    session.isPaused = false;
  };

  return {
    races,
    currentRound,
    sessions,
    currentSessionId,
    currentSession,
    generateProgram,
    setCurrentSession,
    runRace,
    runAllRaces,
    resetRaces,
    getRaceResults,
    getRace,
    startRace,
    pauseRace,
    resumeRace,
    startSession,
    pauseSession,
    resumeSession,
    toggleSessionRace,
    completeSession,
  };
});
