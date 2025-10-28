import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useHorseStore } from '../horse.store';

describe('horse store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initialization', () => {
    it('initializes with 20 horses', () => {
      const store = useHorseStore();

      expect(store.horses).toHaveLength(20);
    });

    it('generates horses with unique ids', () => {
      const store = useHorseStore();

      const ids = store.horses.map(h => h.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('generates horses with valid properties', () => {
      const store = useHorseStore();

      store.horses.forEach(horse => {
        expect(horse).toHaveProperty('id');
        expect(horse).toHaveProperty('name');
        expect(horse).toHaveProperty('color');
        expect(horse).toHaveProperty('conditionScore');
        
        expect(typeof horse.id).toBe('number');
        expect(typeof horse.name).toBe('string');
        expect(typeof horse.color).toBe('string');
        expect(typeof horse.conditionScore).toBe('number');
      });
    });

    it('generates horses with condition scores between 1 and 100', () => {
      const store = useHorseStore();

      store.horses.forEach(horse => {
        expect(horse.conditionScore).toBeGreaterThanOrEqual(1);
        expect(horse.conditionScore).toBeLessThanOrEqual(100);
      });
    });

    it('generates horses with non-empty names', () => {
      const store = useHorseStore();

      store.horses.forEach(horse => {
        expect(horse.name.length).toBeGreaterThan(0);
      });
    });

    it('generates horses with valid hex color codes', () => {
      const store = useHorseStore();

      const hexColorPattern = /^#[0-9A-F]{6}$/i;
      
      store.horses.forEach(horse => {
        expect(horse.color).toMatch(hexColorPattern);
      });
    });
  });

  describe('addHorse', () => {
    it('adds a new horse to the collection', () => {
      const store = useHorseStore();
      const initialCount = store.horses.length;

      const newHorse = store.addHorse({ name: 'Thunder', color: '#FF0000' });

      expect(store.horses).toHaveLength(initialCount + 1);
      expect(store.horses.some(h => h.id === newHorse.id)).toBe(true);
    });

    it('returns the created horse', () => {
      const store = useHorseStore();

      const horse = store.addHorse({ name: 'Lightning', color: '#00FF00' });

      expect(horse).toHaveProperty('id');
      expect(horse).toHaveProperty('name', 'Lightning');
      expect(horse).toHaveProperty('color', '#00FF00');
      expect(horse).toHaveProperty('conditionScore');
    });

    it('generates unique id for new horse', () => {
      const store = useHorseStore();

      const existingIds = store.horses.map(h => h.id);
      const newHorse = store.addHorse({ name: 'Storm', color: '#0000FF' });

      expect(existingIds).not.toContain(newHorse.id);
    });

    it('assigns condition score to new horse', () => {
      const store = useHorseStore();

      const horse = store.addHorse({ name: 'Blaze', color: '#FFFF00' });

      expect(horse.conditionScore).toBeGreaterThanOrEqual(1);
      expect(horse.conditionScore).toBeLessThanOrEqual(100);
    });

    it('adds multiple horses with unique ids', () => {
      const store = useHorseStore();

      const horse1 = store.addHorse({ name: 'Star', color: '#FF00FF' });
      const horse2 = store.addHorse({ name: 'Moon', color: '#00FFFF' });
      const horse3 = store.addHorse({ name: 'Sun', color: '#FFFFFF' });

      expect(horse1.id).not.toBe(horse2.id);
      expect(horse2.id).not.toBe(horse3.id);
      expect(horse1.id).not.toBe(horse3.id);
    });

    it('preserves custom name and color', () => {
      const store = useHorseStore();

      const customName = 'Custom Horse Name';
      const customColor = '#123456';
      const horse = store.addHorse({ name: customName, color: customColor });

      expect(horse.name).toBe(customName);
      expect(horse.color).toBe(customColor);
    });
  });

  describe('generateUniqueId', () => {
    it('generates a unique id', () => {
      const store = useHorseStore();

      const id = store.generateUniqueId();

      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThanOrEqual(0);
      expect(id).toBeLessThan(1000000);
    });

    it('generates different ids on consecutive calls', () => {
      const store = useHorseStore();

      const id1 = store.generateUniqueId();
      const id2 = store.generateUniqueId();
      const id3 = store.generateUniqueId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('does not conflict with existing horse ids', () => {
      const store = useHorseStore();

      const existingIds = store.horses.map(h => h.id);
      const newId = store.generateUniqueId();

      expect(existingIds).not.toContain(newId);
    });

    it('generates many unique ids', () => {
      const store = useHorseStore();

      const ids = new Set<number>();
      for (let i = 0; i < 100; i++) {
        ids.add(store.generateUniqueId());
      }

      expect(ids.size).toBe(100);
    });
  });

  describe('reactive state', () => {
    it('horses array is reactive', () => {
      const store = useHorseStore();
      const initialLength = store.horses.length;

      store.addHorse({ name: 'Test', color: '#000000' });

      expect(store.horses.length).toBe(initialLength + 1);
    });

    it('maintains horse data integrity after additions', () => {
      const store = useHorseStore();

      const firstHorse = store.horses[0];
      store.addHorse({ name: 'New', color: '#AAAAAA' });
      
      expect(store.horses[0]).toEqual(firstHorse);
    });
  });

  describe('edge cases', () => {
    it('handles adding horse with empty name', () => {
      const store = useHorseStore();

      const horse = store.addHorse({ name: '', color: '#FFFFFF' });

      expect(horse.name).toBe('');
      expect(store.horses.some(h => h.id === horse.id)).toBe(true);
    });

    it('handles adding horse with special characters in name', () => {
      const store = useHorseStore();

      const specialName = 'Horse!@#$%^&*()';
      const horse = store.addHorse({ name: specialName, color: '#ABCDEF' });

      expect(horse.name).toBe(specialName);
    });

    it('handles adding multiple horses in sequence', () => {
      const store = useHorseStore();
      const initialCount = store.horses.length;

      for (let i = 0; i < 10; i++) {
        store.addHorse({ name: `Horse${i}`, color: '#FFFFFF' });
      }

      expect(store.horses).toHaveLength(initialCount + 10);
    });
  });
});
