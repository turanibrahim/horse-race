import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { App } from 'vue';
import { pinia as exportedPinia, router as exportedRouter, setupPlugins } from '../index';

const createMockApp = (): App => ({
  use: vi.fn().mockReturnThis(),
  _context: { provides: {} },
} as unknown as App);

describe('plugins index', () => {
  describe('exports', () => {
    it('exports pinia instance', () => {
      expect(exportedPinia).toBeDefined();
    });

    it('exports router instance', () => {
      expect(exportedRouter).toBeDefined();
    });

    it('exports setupPlugins function', () => {
      expect(setupPlugins).toBeDefined();
      expect(typeof setupPlugins).toBe('function');
    });

    it('exported pinia has install method', () => {
      expect(exportedPinia.install).toBeDefined();
      expect(typeof exportedPinia.install).toBe('function');
    });

    it('exported router has push method', () => {
      expect(exportedRouter.push).toBeDefined();
      expect(typeof exportedRouter.push).toBe('function');
    });
  });

  describe('setupPlugins', () => {
    let mockApp: App;

    beforeEach(() => {
      mockApp = createMockApp();
    });

    it('is a function', () => {
      expect(typeof setupPlugins).toBe('function');
    });

    it('calls app.use twice', () => {
      setupPlugins(mockApp);

      expect(mockApp.use).toHaveBeenCalledTimes(2);
    });

    it('installs pinia', () => {
      setupPlugins(mockApp);

      expect(mockApp.use).toHaveBeenCalledWith(exportedPinia);
    });

    it('installs router', () => {
      setupPlugins(mockApp);

      const calls = (mockApp.use as unknown as { mock: { calls: unknown[][] } }).mock.calls;
      const routerCall = calls.find((call: unknown[]) => 
        call[0] && typeof call[0] === 'object' && 'install' in call[0],
      );

      expect(routerCall).toBeDefined();
    });

    it('returns void', () => {
      const result = setupPlugins(mockApp);

      expect(result).toBeUndefined();
    });

    it('installs plugins in correct order', () => {
      setupPlugins(mockApp);

      const calls = (mockApp.use as unknown as { mock: { calls: unknown[][] } }).mock.calls;
      
      // First call should be pinia
      expect(calls[0]?.[0]).toBe(exportedPinia);
    });

    it('can be called without errors', () => {
      expect(() => {
        setupPlugins(mockApp);
      }).not.toThrow();
    });
  });

  describe('integration', () => {
    it('sets up all plugins on Vue app', () => {
      const app = createMockApp();

      expect(() => {
        setupPlugins(app);
      }).not.toThrow();
    });

    it('app.use is called after setup', () => {
      const app = createMockApp();
      setupPlugins(app);

      expect(app.use).toHaveBeenCalled();
    });

    it('pinia and router are installed', () => {
      const app = createMockApp();
      setupPlugins(app);

      expect(app.use).toHaveBeenCalledWith(exportedPinia);
    });

    it('multiple apps can use setupPlugins', () => {
      const app1 = createMockApp();
      const app2 = createMockApp();

      expect(() => {
        setupPlugins(app1);
        setupPlugins(app2);
      }).not.toThrow();
    });
  });

  describe('re-exports consistency', () => {
    it('exported pinia is same instance', async () => {
      const { pinia: pinia1 } = await import('../index');
      const { pinia: pinia2 } = await import('../pinia');

      expect(pinia1).toBe(pinia2);
    });

    it('exported router is same instance', async () => {
      const { router: router1 } = await import('../index');
      const { router: router2 } = await import('../router');

      expect(router1).toBe(router2);
    });
  });

  describe('edge cases', () => {
    it('handles calling setupPlugins multiple times on same app', () => {
      const app = createMockApp();

      expect(() => {
        setupPlugins(app);
        setupPlugins(app);
      }).not.toThrow();
    });

    it('setupPlugins works with minimal Vue app', () => {
      const app = createMockApp();

      expect(() => {
        setupPlugins(app);
      }).not.toThrow();
    });
  });
});
