import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useRaceStore } from '../race.store';
import { useHorseStore } from '../horse.store';

describe('race store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('initializes with empty races array', () => {
      const store = useRaceStore();

      expect(store.races).toEqual([]);
    });

    it('initializes with empty sessions array', () => {
      const store = useRaceStore();

      expect(store.sessions).toEqual([]);
    });

    it('initializes with currentRound as 1', () => {
      const store = useRaceStore();

      expect(store.currentRound).toBe(1);
    });

    it('initializes with null currentSessionId', () => {
      const store = useRaceStore();

      expect(store.currentSessionId).toBeNull();
    });

    it('initializes with null activeRaceSessionId', () => {
      const store = useRaceStore();

      expect(store.activeRaceSessionId).toBeNull();
    });

    it('initializes with empty horsePositions map', () => {
      const store = useRaceStore();

      expect(store.horsePositions.size).toBe(0);
    });

    it('initializes with empty finishedHorses set', () => {
      const store = useRaceStore();

      expect(store.finishedHorses.size).toBe(0);
    });
  });

  describe('generateProgram', () => {
    it('generates sessions with horses', () => {
      const store = useRaceStore();

      store.generateProgram();

      expect(store.sessions.length).toBeGreaterThan(0);
    });

    it('generates sessions with correct structure', () => {
      const store = useRaceStore();

      store.generateProgram();

      store.sessions.forEach(session => {
        expect(session).toHaveProperty('id');
        expect(session).toHaveProperty('name');
        expect(session).toHaveProperty('distance');
        expect(session).toHaveProperty('horses');
        expect(session).toHaveProperty('results');
        expect(session).toHaveProperty('isCompleted');
        expect(session).toHaveProperty('isRunning');
        expect(session).toHaveProperty('isPaused');
        expect(session).toHaveProperty('createdAt');
      });
    });

    it('generates sessions with 10 horses each', () => {
      const store = useRaceStore();

      store.generateProgram();

      store.sessions.forEach(session => {
        expect(session.horses).toHaveLength(10);
      });
    });

    it('sets currentSessionId to first session if null', () => {
      const store = useRaceStore();

      store.generateProgram();

      expect(store.currentSessionId).toBe(store.sessions[0]?.id);
    });

    it('generates sessions with empty results initially', () => {
      const store = useRaceStore();

      store.generateProgram();

      store.sessions.forEach(session => {
        expect(session.results).toEqual([]);
      });
    });

    it('generates sessions with isCompleted false', () => {
      const store = useRaceStore();

      store.generateProgram();

      store.sessions.forEach(session => {
        expect(session.isCompleted).toBe(false);
      });
    });

    it('generates sessions with isRunning false', () => {
      const store = useRaceStore();

      store.generateProgram();

      store.sessions.forEach(session => {
        expect(session.isRunning).toBe(false);
      });
    });

    it('generates sessions with unique ids', () => {
      const store = useRaceStore();

      store.generateProgram();

      const ids = store.sessions.map(s => s.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('generates multiple programs with incremental ids', () => {
      const store = useRaceStore();

      store.generateProgram();
      const firstProgramCount = store.sessions.length;
      const firstProgramLastId = store.sessions[store.sessions.length - 1]?.id || 0;

      store.generateProgram();

      expect(store.sessions.length).toBeGreaterThan(firstProgramCount);
      expect(store.sessions[firstProgramCount]?.id).toBeGreaterThan(firstProgramLastId);
    });
  });

  describe('currentSession computed', () => {
    it('returns null when currentSessionId is null', () => {
      const store = useRaceStore();

      expect(store.currentSession).toBeUndefined();
    });

    it('returns correct session when currentSessionId is set', () => {
      const store = useRaceStore();

      store.generateProgram();
      const firstSessionId = store.sessions[0]?.id;
      store.setCurrentSession(firstSessionId!);

      expect(store.currentSession?.id).toBe(firstSessionId);
    });

    it('updates when currentSessionId changes', () => {
      const store = useRaceStore();

      store.generateProgram();
      const firstSessionId = store.sessions[0]?.id;
      const secondSessionId = store.sessions[1]?.id;

      store.setCurrentSession(firstSessionId!);
      expect(store.currentSession?.id).toBe(firstSessionId);

      store.setCurrentSession(secondSessionId!);
      expect(store.currentSession?.id).toBe(secondSessionId);
    });
  });

  describe('activeRaceSession computed', () => {
    it('returns undefined when activeRaceSessionId is null', () => {
      const store = useRaceStore();

      expect(store.activeRaceSession).toBeUndefined();
    });

    it('returns correct session when activeRaceSessionId is set', () => {
      const store = useRaceStore();

      store.generateProgram();
      const firstSessionId = store.sessions[0]?.id;
      store.activeRaceSessionId = firstSessionId!;

      expect(store.activeRaceSession?.id).toBe(firstSessionId);
    });
  });

  describe('setCurrentSession', () => {
    it('sets currentSessionId', () => {
      const store = useRaceStore();

      store.generateProgram();
      const sessionId = store.sessions[0]?.id;
      
      store.setCurrentSession(sessionId!);

      expect(store.currentSessionId).toBe(sessionId);
    });

    it('updates currentSession computed property', () => {
      const store = useRaceStore();

      store.generateProgram();
      const sessionId = store.sessions[1]?.id;
      
      store.setCurrentSession(sessionId!);

      expect(store.currentSession?.id).toBe(sessionId);
    });
  });

  describe('resetRaces', () => {
    it('clears races array', () => {
      const store = useRaceStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      store.resetRaces();

      expect(store.races).toEqual([]);
    });

    it('resets currentRound to 1', () => {
      const store = useRaceStore();

      store.currentRound = 5;
      store.resetRaces();

      expect(store.currentRound).toBe(1);
    });
  });

  describe('getRace', () => {
    it('returns undefined for non-existent round', () => {
      const store = useRaceStore();

      const race = store.getRace(1);

      expect(race).toBeUndefined();
    });

    it('returns correct race for given round', () => {
      const store = useRaceStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      const race = store.getRace(1);

      expect(race?.round).toBe(1);
    });
  });

  describe('getRaceResults', () => {
    it('returns empty array for non-existent round', () => {
      const store = useRaceStore();

      const results = store.getRaceResults(1);

      expect(results).toEqual([]);
    });

    it('returns results for existing race', () => {
      const store = useRaceStore();

      const mockResults = [
        { horseId: 1, horseName: 'Test', position: 1, finishTime: 10.5 },
      ];

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [],
          results: mockResults,
          isCompleted: true,
          isRunning: false,
          isPaused: false,
        },
      ];

      const results = store.getRaceResults(1);

      expect(results).toEqual(mockResults);
    });
  });

  describe('runRace', () => {
    it('throws error for non-existent round', () => {
      const store = useRaceStore();

      expect(() => store.runRace(1)).toThrow('Race round 1 not found');
    });

    it('returns existing results if race already completed', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      const mockResults = [
        { horseId: 1, horseName: 'Test', position: 1, finishTime: 10.5 },
      ];

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: mockResults,
          isCompleted: true,
          isRunning: false,
          isPaused: false,
        },
      ];

      const results = store.runRace(1);

      expect(results).toEqual(mockResults);
    });

    it('generates results for incomplete race', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!, horseStore.horses[1]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      const results = store.runRace(1);

      expect(results).toHaveLength(2);
      expect(results[0]?.position).toBe(1);
      expect(results[1]?.position).toBe(2);
    });

    it('marks race as completed after running', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      store.runRace(1);

      expect(store.races[0]?.isCompleted).toBe(true);
      expect(store.races[0]?.isRunning).toBe(false);
    });

    it('stores results in race object', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      const results = store.runRace(1);

      expect(store.races[0]?.results).toEqual(results);
    });
  });

  describe('runAllRaces', () => {
    it('runs all incomplete races', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
        {
          round: 2,
          distance: 1400,
          horses: [horseStore.horses[1]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      store.runAllRaces();

      expect(store.races[0]?.isCompleted).toBe(true);
      expect(store.races[1]?.isCompleted).toBe(true);
    });

    it('skips already completed races', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      const existingResults = [
        { horseId: 1, horseName: 'Test', position: 1, finishTime: 10.5 },
      ];

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: existingResults,
          isCompleted: true,
          isRunning: false,
          isPaused: false,
        },
      ];

      store.runAllRaces();

      expect(store.races[0]?.results).toEqual(existingResults);
    });
  });

  describe('startRace', () => {
    it('throws error for non-existent round', () => {
      const store = useRaceStore();

      expect(() => store.startRace(1)).toThrow('Race round 1 not found');
    });

    it('throws error for completed race', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: true,
          isRunning: false,
          isPaused: false,
        },
      ];

      expect(() => store.startRace(1)).toThrow('Race round 1 has already been completed');
    });

    it('sets isRunning to true', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      store.startRace(1);

      expect(store.races[0]?.isRunning).toBe(true);
    });

    it('sets isPaused to false', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: true,
        },
      ];

      store.startRace(1);

      expect(store.races[0]?.isPaused).toBe(false);
    });
  });

  describe('pauseRace', () => {
    it('throws error for non-existent round', () => {
      const store = useRaceStore();

      expect(() => store.pauseRace(1)).toThrow('Race round 1 not found');
    });

    it('throws error if race is not running', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: false,
        },
      ];

      expect(() => store.pauseRace(1)).toThrow('Race round 1 is not running');
    });

    it('throws error if race is completed', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: true,
          isRunning: true,
          isPaused: false,
        },
      ];

      expect(() => store.pauseRace(1)).toThrow('Race round 1 has already been completed');
    });

    it('sets isPaused to true', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: true,
          isPaused: false,
        },
      ];

      store.pauseRace(1);

      expect(store.races[0]?.isPaused).toBe(true);
    });
  });

  describe('resumeRace', () => {
    it('throws error for non-existent round', () => {
      const store = useRaceStore();

      expect(() => store.resumeRace(1)).toThrow('Race round 1 not found');
    });

    it('throws error if race is not running', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: false,
          isPaused: true,
        },
      ];

      expect(() => store.resumeRace(1)).toThrow('Race round 1 is not running');
    });

    it('sets isPaused to false', () => {
      const store = useRaceStore();
      const horseStore = useHorseStore();

      store.races = [
        {
          round: 1,
          distance: 1200,
          horses: [horseStore.horses[0]!],
          results: [],
          isCompleted: false,
          isRunning: true,
          isPaused: true,
        },
      ];

      store.resumeRace(1);

      expect(store.races[0]?.isPaused).toBe(false);
    });
  });

  describe('startAllRaces', () => {
    it('does nothing if no sessions exist', () => {
      const store = useRaceStore();

      store.startAllRaces();

      expect(store.activeRaceSessionId).toBeNull();
    });

    it('sets activeRaceSessionId to first uncompleted session', () => {
      const store = useRaceStore();

      store.generateProgram();
      store.startAllRaces();

      expect(store.activeRaceSessionId).toBe(store.sessions[0]?.id);
    });

    it('initializes horsePositions for active session', () => {
      const store = useRaceStore();

      store.generateProgram();
      store.startAllRaces();

      expect(store.horsePositions.size).toBeGreaterThan(0);
    });
  });

  describe('completeSession', () => {
    it('marks session as completed', () => {
      const store = useRaceStore();

      store.generateProgram();
      const session = store.sessions[0];
      store.setCurrentSession(session!.id);

      const results = [
        { horseId: 1, horseName: 'Test', position: 1, finishTime: 10.5 },
      ];

      store.completeSession(results);

      expect(session?.isCompleted).toBe(true);
    });

    it('stores results in session', () => {
      const store = useRaceStore();

      store.generateProgram();
      const session = store.sessions[0];
      store.setCurrentSession(session!.id);

      const results = [
        { horseId: 1, horseName: 'Test', position: 1, finishTime: 10.5 },
      ];

      store.completeSession(results);

      expect(session?.results).toEqual(results);
    });

    it('sets isRunning to false', () => {
      const store = useRaceStore();

      store.generateProgram();
      const session = store.sessions[0];
      store.setCurrentSession(session!.id);
      session!.isRunning = true;

      store.completeSession([]);

      expect(session?.isRunning).toBe(false);
    });

    it('sets isPaused to false', () => {
      const store = useRaceStore();

      store.generateProgram();
      const session = store.sessions[0];
      store.setCurrentSession(session!.id);
      session!.isPaused = true;

      store.completeSession([]);

      expect(session?.isPaused).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles empty sessions array gracefully', () => {
      const store = useRaceStore();

      expect(store.currentSession).toBeUndefined();
      expect(store.activeRaceSession).toBeUndefined();
    });

    it('handles invalid session id in setCurrentSession', () => {
      const store = useRaceStore();

      store.setCurrentSession(9999);

      expect(store.currentSessionId).toBe(9999);
      expect(store.currentSession).toBeUndefined();
    });

    it('maintains data integrity with multiple operations', () => {
      const store = useRaceStore();

      store.generateProgram();
      const firstSessionId = store.sessions[0]?.id;
      store.setCurrentSession(firstSessionId!);
      
      expect(store.currentSession?.id).toBe(firstSessionId);
      expect(store.sessions[0]?.id).toBe(firstSessionId);
    });
  });
});
