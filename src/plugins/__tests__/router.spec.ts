import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { App } from 'vue';
import routerPlugin, { router } from '../router';

const createMockApp = (): App => ({
  use: vi.fn().mockReturnThis(),
  _context: { provides: {} },
} as unknown as App);

describe('router plugin', () => {
  describe('router instance', () => {
    it('exports a router instance', () => {
      expect(router).toBeDefined();
    });

    it('router has push method', () => {
      expect(router.push).toBeDefined();
      expect(typeof router.push).toBe('function');
    });

    it('router has replace method', () => {
      expect(router.replace).toBeDefined();
      expect(typeof router.replace).toBe('function');
    });

    it('router has back method', () => {
      expect(router.back).toBeDefined();
      expect(typeof router.back).toBe('function');
    });

    it('router has forward method', () => {
      expect(router.forward).toBeDefined();
      expect(typeof router.forward).toBe('function');
    });

    it('router has currentRoute property', () => {
      expect(router.currentRoute).toBeDefined();
    });

    it('router has options property', () => {
      expect(router.options).toBeDefined();
    });

    it('router options has routes', () => {
      expect(router.options.routes).toBeDefined();
      expect(Array.isArray(router.options.routes)).toBe(true);
    });

    it('router has correct number of routes', () => {
      expect(router.options.routes).toHaveLength(2);
    });
  });

  describe('routes configuration', () => {
    it('has racing-dashboard route', () => {
      const dashboardRoute = router.options.routes.find(
        r => r.name === 'racing-dashboard',
      );

      expect(dashboardRoute).toBeDefined();
      expect(dashboardRoute?.path).toBe('/');
    });

    it('has theme route', () => {
      const themeRoute = router.options.routes.find(
        r => r.name === 'theme',
      );

      expect(themeRoute).toBeDefined();
      expect(themeRoute?.path).toBe('/theme');
    });

    it('racing-dashboard route has lazy-loaded component', () => {
      const dashboardRoute = router.options.routes.find(
        r => r.name === 'racing-dashboard',
      );

      expect(dashboardRoute?.component).toBeDefined();
      expect(typeof dashboardRoute?.component).toBe('function');
    });

    it('theme route has lazy-loaded component', () => {
      const themeRoute = router.options.routes.find(
        r => r.name === 'theme',
      );

      expect(themeRoute?.component).toBeDefined();
      expect(typeof themeRoute?.component).toBe('function');
    });

    it('all routes have unique names', () => {
      const names = router.options.routes.map(r => r.name);
      const uniqueNames = new Set(names);

      expect(uniqueNames.size).toBe(names.length);
    });

    it('all routes have unique paths', () => {
      const paths = router.options.routes.map(r => r.path);
      const uniquePaths = new Set(paths);

      expect(uniquePaths.size).toBe(paths.length);
    });
  });

  describe('router plugin', () => {
    let mockApp: App;

    beforeEach(() => {
      mockApp = createMockApp();
    });

    it('exports a plugin object', () => {
      expect(routerPlugin).toBeDefined();
      expect(typeof routerPlugin).toBe('object');
    });

    it('plugin has install method', () => {
      expect(routerPlugin.install).toBeDefined();
      expect(typeof routerPlugin.install).toBe('function');
    });

    it('install method calls app.use with router', () => {
      routerPlugin.install(mockApp);

      expect(mockApp.use).toHaveBeenCalledWith(router);
    });

    it('install method calls app.use exactly once', () => {
      routerPlugin.install(mockApp);

      expect(mockApp.use).toHaveBeenCalledTimes(1);
    });

    it('can be installed using app.use', () => {
      expect(() => {
        mockApp.use(routerPlugin);
      }).not.toThrow();
    });
  });

  describe('router functionality', () => {
    it('router can navigate to racing-dashboard', async () => {
      await router.push({ name: 'racing-dashboard' });

      expect(router.currentRoute.value.name).toBe('racing-dashboard');
    });

    it('router can navigate to theme', async () => {
      await router.push({ name: 'theme' });

      expect(router.currentRoute.value.name).toBe('theme');
    });

    it('router can navigate using path', async () => {
      await router.push('/theme');

      expect(router.currentRoute.value.path).toBe('/theme');
    });

    it('router updates currentRoute after navigation', async () => {
      await router.push('/');
      expect(router.currentRoute.value.path).toBe('/');

      await router.push('/theme');
      expect(router.currentRoute.value.path).toBe('/theme');
    });

    it('router isReady resolves', async () => {
      await expect(router.isReady()).resolves.toBeUndefined();
    });
  });

  describe('history mode', () => {
    it('uses web history mode', () => {
      expect(router.options.history).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('handles navigation to non-existent route', async () => {
      try {
        await router.push('/non-existent-route');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('handles multiple consecutive navigations', async () => {
      await router.push('/');
      await router.push('/theme');
      await router.push('/');

      expect(router.currentRoute.value.path).toBe('/');
    });
  });
});
