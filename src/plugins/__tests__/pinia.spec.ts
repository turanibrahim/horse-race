import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { App } from 'vue';
import { pinia, setupPinia } from '../pinia';

const createMockApp = (): App => ({
  use: vi.fn().mockReturnThis(),
  _context: { provides: {} },
} as unknown as App);

describe('pinia plugin', () => {
  describe('pinia instance', () => {
    it('exports a pinia instance', () => {
      expect(pinia).toBeDefined();
    });

    it('pinia instance has install method', () => {
      expect(pinia.install).toBeDefined();
      expect(typeof pinia.install).toBe('function');
    });

    it('pinia instance has state property', () => {
      expect(pinia.state).toBeDefined();
    });
  });

  describe('setupPinia', () => {
    let mockApp: App;

    beforeEach(() => {
      mockApp = createMockApp();
    });

    it('is a function', () => {
      expect(setupPinia).toBeDefined();
      expect(typeof setupPinia).toBe('function');
    });

    it('calls app.use with pinia instance', () => {
      setupPinia(mockApp);

      expect(mockApp.use).toHaveBeenCalledWith(pinia);
    });

    it('calls app.use exactly once', () => {
      setupPinia(mockApp);

      expect(mockApp.use).toHaveBeenCalledTimes(1);
    });

    it('returns void', () => {
      const result = setupPinia(mockApp);

      expect(result).toBeUndefined();
    });

    it('can be called multiple times without error', () => {
      expect(() => {
        setupPinia(mockApp);
        setupPinia(mockApp);
      }).not.toThrow();
    });
  });

  describe('integration', () => {
    it('pinia instance can be used with app.use', () => {
      const mockApp = createMockApp();

      expect(() => {
        setupPinia(mockApp);
      }).not.toThrow();
    });

    it('app.use is called with pinia', () => {
      const mockApp = createMockApp();
      setupPinia(mockApp);

      expect(mockApp.use).toHaveBeenCalledWith(pinia);
    });
  });
});
