import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Horse, Race, RaceResult, Session } from '@/types';
import { useHorseStore } from '@/store/horse.store';
import { BASE_SPEED, RACE_DISTANCES, TRACK_LENGTH } from '@/constants';

const selectRandomHorses = (allHorses: Horse[], count: number): Horse[] => {
  const shuffled = [...allHorses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const calculateSpeedFactor = (horse: Horse): number => {
  const baseVariation = 0.85 + Math.random() * 0.3;
  const conditionFactor = horse.conditionScore / 100;
  return baseVariation * (0.8 + conditionFactor * 0.4);
};

const calculateFinishTime = (horse: Horse, distance: number): number => {
  const baseTime = distance / 100;
  const randomFactor = 0.9 + Math.random() * 0.2;
  const conditionFactor = 2 - (horse.conditionScore / 100);
  const finishTime = baseTime * conditionFactor * randomFactor;
  return Math.round(finishTime * 100) / 100;
};

const createRaceResults = (horses: Horse[], finishTimes: Map<number, number>): RaceResult[] => {
  const results = horses.map(horse => ({
    horseId: horse.id,
    horseName: horse.name,
    finishTime: finishTimes.get(horse.id) || 0,
    position: 0,
  }));

  results.sort((a, b) => a.finishTime - b.finishTime);
  results.forEach((result, index) => {
    result.position = index + 1;
  });

  return results;
};

const createSession = ({ id, distance, horses }: { id: number; distance: number; horses: Horse[] }): Session => ({
  id,
  name: `Race ${id} - ${distance}m`,
  distance,
  horses,
  results: [],
  isCompleted: false,
  isRunning: false,
  isPaused: false,
  createdAt: new Date(),
});

export const useRaceStore = defineStore('race', () => {
  const horseStore = useHorseStore();

  const races = ref<Race[]>([]);
  const currentRound = ref<number>(1);
  const sessions = ref<Session[]>([]);
  const currentSessionId = ref<number | null>(null);
  const activeRaceSessionId = ref<number | null>(null);

  const horsePositions = ref<Map<number, number>>(new Map());
  const horseSpeedFactors = ref<Map<number, number>>(new Map());
  const finishedHorses = ref<Set<number>>(new Set());
  const horseFinishTimes = ref<Map<number, number>>(new Map());
  
  const startTime = ref<number>(0);
  const pausedTime = ref<number>(0);
  const totalPausedDuration = ref<number>(0);
  const animationFrameId = ref<number | null>(null);

  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value),
  );

  const activeRaceSession = computed(() => 
    sessions.value.find(s => s.id === activeRaceSessionId.value),
  );

  const initializeSpeedFactors = (horses: Horse[]) => {
    horseSpeedFactors.value.clear();
    horses.forEach(horse => {
      horseSpeedFactors.value.set(horse.id, calculateSpeedFactor(horse));
    });
  };

  const resetAnimationState = () => {
    horsePositions.value.clear();
    finishedHorses.value.clear();
    horseFinishTimes.value.clear();
    startTime.value = 0;
    pausedTime.value = 0;
    totalPausedDuration.value = 0;
  };

  const initializeAnimation = (horses: Horse[]) => {
    resetAnimationState();
    horses.forEach(horse => {
      horsePositions.value.set(horse.id, 0);
    });
    initializeSpeedFactors(horses);
  };

  const stopAnimation = () => {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
  };

  const handlePausedState = (timestamp: number) => {
    if (!pausedTime.value) {
      pausedTime.value = timestamp;
    }
  };

  const handleResumeFromPause = (timestamp: number) => {
    if (pausedTime.value) {
      totalPausedDuration.value += timestamp - pausedTime.value;
      pausedTime.value = 0;
    }
  };

  const updateHorsePosition = ({ horse, elapsed }: { horse: Horse; elapsed: number }): boolean => {
    if (finishedHorses.value.has(horse.id)) return true;

    const speedFactor = horseSpeedFactors.value.get(horse.id) || 1;
    const speed = BASE_SPEED * speedFactor;
    const newPosition = Math.min(speed * elapsed, TRACK_LENGTH);

    horsePositions.value.set(horse.id, newPosition);

    if (newPosition >= TRACK_LENGTH && !finishedHorses.value.has(horse.id)) {
      finishedHorses.value.add(horse.id);
      horseFinishTimes.value.set(horse.id, elapsed);
      return true;
    }

    return newPosition >= TRACK_LENGTH;
  };

  const checkRaceCompletion = (session: Session): boolean => {
    return finishedHorses.value.size === session.horses.length;
  };

  const finalizeRaceResults = (session: Session) => {
    const results = createRaceResults(session.horses, horseFinishTimes.value);
    completeActiveRaceSession(results);
  };

  const animate = (timestamp: number) => {
    const session = activeRaceSession.value;
    if (!session) return;

    if (!startTime.value) {
      startTime.value = timestamp;
    }

    if (session.isPaused) {
      handlePausedState(timestamp);
      animationFrameId.value = requestAnimationFrame(animate);
      return;
    }

    handleResumeFromPause(timestamp);

    const elapsed = (timestamp - startTime.value - totalPausedDuration.value) / 1000;
    
    session.horses.forEach(horse => {
      updateHorsePosition({ horse, elapsed });
    });

    if (checkRaceCompletion(session)) {
      finalizeRaceResults(session);
      return;
    }

    animationFrameId.value = requestAnimationFrame(animate);
  };

  const generateProgram = () => {
    const startId = sessions.value.length + 1;
    
    const newSessions = RACE_DISTANCES.map((distance, index) => 
      createSession({
        id: startId + index,
        distance,
        horses: selectRandomHorses(horseStore.horses, 10),
      }),
    );

    sessions.value = [...sessions.value, ...newSessions];
    
    if (!currentSessionId.value && newSessions.length > 0) {
      currentSessionId.value = newSessions[0]!.id;
    }
  };

  const findRaceByRound = (round: number): Race | undefined => {
    return races.value[round - 1];
  };

  const validateRaceExists = (race: Race | undefined, round: number) => {
    if (!race) {
      throw new Error(`Race round ${round} not found`);
    }
  };

  const runRace = (round: number): RaceResult[] => {
    const race = findRaceByRound(round);
    validateRaceExists(race, round);
    
    if (race!.isCompleted) {
      return race!.results;
    }

    const finishTimes = new Map(
      race!.horses.map(horse => [horse.id, calculateFinishTime(horse, race!.distance)]),
    );

    const results = createRaceResults(race!.horses, finishTimes);

    race!.results = results;
    race!.isCompleted = true;
    race!.isRunning = false;
    race!.isPaused = false;

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
    races.value = [];
    currentRound.value = 1;
  };

  const getRaceResults = (round: number): RaceResult[] => {
    const race = findRaceByRound(round);
    return race?.results || [];
  };

  const getRace = (round: number): Race | undefined => {
    return findRaceByRound(round);
  };

  const updateRaceState = ({ round, updates }: { round: number; updates: Partial<Race> }) => {
    const race = findRaceByRound(round);
    validateRaceExists(race, round);
    Object.assign(race!, updates);
  };

  const startRace = (round: number): void => {
    const race = findRaceByRound(round);
    validateRaceExists(race, round);

    if (race!.isCompleted) {
      throw new Error(`Race round ${round} has already been completed`);
    }

    updateRaceState({ round, updates: { isRunning: true, isPaused: false } });
  };

  const pauseRace = (round: number): void => {
    const race = findRaceByRound(round);
    validateRaceExists(race, round);

    if (!race!.isRunning) {
      throw new Error(`Race round ${round} is not running`);
    }

    if (race!.isCompleted) {
      throw new Error(`Race round ${round} has already been completed`);
    }

    updateRaceState({ round, updates: { isPaused: true } });
  };

  const resumeRace = (round: number): void => {
    const race = findRaceByRound(round);
    validateRaceExists(race, round);

    if (!race!.isRunning) {
      throw new Error(`Race round ${round} is not running`);
    }

    updateRaceState({ round, updates: { isPaused: false } });
  };

  const updateSessionState = (session: Session, updates: Partial<Session>) => {
    Object.assign(session, updates);
  };

  const startSession = () => {
    const session = activeRaceSession.value;
    if (!session || session.isCompleted) return;

    updateSessionState(session, { isRunning: true, isPaused: false });

    if (horsePositions.value.size === 0) {
      initializeAnimation(session.horses);
    }
    
    if (!animationFrameId.value) {
      animationFrameId.value = requestAnimationFrame(animate);
    }
  };

  const pauseSession = () => {
    const session = activeRaceSession.value;
    if (!session || !session.isRunning) return;

    updateSessionState(session, { isPaused: true });
  };

  const resumeSession = () => {
    const session = activeRaceSession.value;
    if (!session || !session.isRunning) return;

    updateSessionState(session, { isPaused: false });
  };

  const toggleSessionRace = () => {
    const session = activeRaceSession.value;
    if (!session || session.isCompleted) return;

    if (!session.isRunning) {
      startSession();
    } else if (session.isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  const findNextUncompletedSession = (currentSessionId: number): Session | undefined => {
    return sessions.value.find(s => !s.isCompleted && s.id !== currentSessionId);
  };

  const startNextSession = (nextSession: Session) => {
    activeRaceSessionId.value = nextSession.id;
    initializeAnimation(nextSession.horses);
    updateSessionState(nextSession, { isRunning: true, isPaused: false });
    animationFrameId.value = requestAnimationFrame(animate);
  };

  const completeActiveRaceSession = (results: RaceResult[]) => {
    const session = activeRaceSession.value;
    if (!session) return;

    updateSessionState(session, {
      results,
      isCompleted: true,
      isRunning: false,
      isPaused: false,
    });
    
    stopAnimation();

    const nextSession = findNextUncompletedSession(session.id);
    
    if (nextSession) {
      startNextSession(nextSession);
    } else {
      activeRaceSessionId.value = null;
    }
  };

  const completeSession = (results: RaceResult[]) => {
    const session = currentSession.value;
    if (!session) return;

    updateSessionState(session, {
      results,
      isCompleted: true,
      isRunning: false,
      isPaused: false,
    });
    
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
    initializeAnimation(firstUncompletedSession.horses);
    startSession();
  };

  return {
    races,
    currentRound,
    sessions,
    currentSessionId,
    activeRaceSessionId,
    horsePositions,
    currentSession,
    activeRaceSession,
    
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
