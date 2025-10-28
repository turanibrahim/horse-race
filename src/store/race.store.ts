import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Horse, Race, RaceResult, Session } from '@/types';
import { useHorseStore } from '@/store/horse.store';

const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];
const TRACK_LENGTH = 100;
const BASE_SPEED = 1.5;

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
  const activeRaceSessionId = ref<number | null>(null);
  
  const horsePositions = ref<Map<number, number>>(new Map());
  const startTime = ref<number>(0);
  const pausedTime = ref<number>(0);
  const totalPausedDuration = ref<number>(0);
  const animationFrameId = ref<number | null>(null);
  const finishedHorses = ref<Set<number>>(new Set());
  const horseFinishTimes = ref<Map<number, number>>(new Map());
  const horseSpeedFactors = ref<Map<number, number>>(new Map());

  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value),
  );

  const activeRaceSession = computed(() => 
    sessions.value.find(s => s.id === activeRaceSessionId.value),
  );

  const initializeHorseSpeedFactors = (horses: Horse[]) => {
    horseSpeedFactors.value.clear();
    horses.forEach(horse => {
      const baseVariation = 0.85 + Math.random() * 0.3;
      const conditionFactor = horse.conditionScore / 100;
      const speedFactor = baseVariation * (0.8 + conditionFactor * 0.4);
      horseSpeedFactors.value.set(horse.id, speedFactor);
    });
  };

  const initializeRaceAnimation = (horses: Horse[]) => {
    horsePositions.value.clear();
    finishedHorses.value.clear();
    horseFinishTimes.value.clear();
    horses.forEach(horse => {
      horsePositions.value.set(horse.id, 0);
    });
    startTime.value = 0;
    pausedTime.value = 0;
    totalPausedDuration.value = 0;
    initializeHorseSpeedFactors(horses);
  };

  const animate = (timestamp: number) => {
    const session = activeRaceSession.value;
    if (!session) return;

    if (!startTime.value) {
      startTime.value = timestamp;
    }

    if (session.isPaused) {
      if (!pausedTime.value) {
        pausedTime.value = timestamp;
      }
      animationFrameId.value = requestAnimationFrame(animate);
      return;
    }

    if (pausedTime.value) {
      totalPausedDuration.value += timestamp - pausedTime.value;
      pausedTime.value = 0;
    }

    const elapsed = (timestamp - startTime.value - totalPausedDuration.value) / 1000;
    let allFinished = true;

    session.horses.forEach(horse => {
      if (finishedHorses.value.has(horse.id)) return;

      const speedFactor = horseSpeedFactors.value.get(horse.id) || 1;
      const speed = BASE_SPEED * speedFactor;
      const newPosition = Math.min(speed * elapsed, TRACK_LENGTH);

      horsePositions.value.set(horse.id, newPosition);

      if (newPosition >= TRACK_LENGTH && !finishedHorses.value.has(horse.id)) {
        finishedHorses.value.add(horse.id);
        horseFinishTimes.value.set(horse.id, elapsed);
      }

      if (newPosition < TRACK_LENGTH) {
        allFinished = false;
      }
    });

    if (allFinished && finishedHorses.value.size === session.horses.length) {
      const results = session.horses.map(horse => ({
        horseId: horse.id,
        horseName: horse.name,
        finishTime: horseFinishTimes.value.get(horse.id) || 0,
        position: 0,
      }));

      results.sort((a, b) => a.finishTime - b.finishTime);
      results.forEach((result, index) => {
        result.position = index + 1;
      });

      completeActiveRaceSession(results);
      return;
    }

    animationFrameId.value = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
  };

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
    const session = activeRaceSession.value;
    if (!session) return;

    if (session.isCompleted) return;

    session.isRunning = true;
    session.isPaused = false;

    if (horsePositions.value.size === 0) {
      initializeRaceAnimation(session.horses);
    }
    
    if (!animationFrameId.value) {
      animationFrameId.value = requestAnimationFrame(animate);
    }
  };

  const pauseSession = () => {
    const session = activeRaceSession.value;
    if (!session) return;

    if (!session.isRunning) return;

    session.isPaused = true;
  };

  const resumeSession = () => {
    const session = activeRaceSession.value;
    if (!session) return;

    if (!session.isRunning) return;

    session.isPaused = false;
  };

  const toggleSessionRace = () => {
    const session = activeRaceSession.value;
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

  const completeActiveRaceSession = (results: RaceResult[]) => {
    const session = activeRaceSession.value;
    if (!session) return;

    session.results = results;
    session.isCompleted = true;
    session.isRunning = false;
    session.isPaused = false;
    stopAnimation();

    const nextSession = sessions.value.find(
      s => !s.isCompleted && s.id !== session.id,
    );
    
    if (nextSession) {
      activeRaceSessionId.value = nextSession.id;
      initializeRaceAnimation(nextSession.horses);
      nextSession.isRunning = true;
      nextSession.isPaused = false;
      animationFrameId.value = requestAnimationFrame(animate);
    } else {
      activeRaceSessionId.value = null;
    }
  };

  const completeSession = (results: RaceResult[]) => {
    const session = currentSession.value;
    if (!session) return;

    session.results = results;
    session.isCompleted = true;
    session.isRunning = false;
    session.isPaused = false;
    stopAnimation();
  };

  const setCurrentSession = (sessionId: number) => {
    currentSessionId.value = sessionId;
  };

  const startAllRaces = () => {
    const firstUncompletedSession = sessions.value.find(s => !s.isCompleted);
    if (!firstUncompletedSession) return;

    stopAnimation();
    activeRaceSessionId.value = firstUncompletedSession.id;
    initializeRaceAnimation(firstUncompletedSession.horses);
    startSession();
  };

  return {
    races,
    currentRound,
    sessions,
    currentSessionId,
    currentSession,
    activeRaceSessionId,
    activeRaceSession,
    horsePositions,
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
    startAllRaces,
  };
});
