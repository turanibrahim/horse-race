import type { App } from 'vue';
import { setupPinia } from '@/plugins/pinia';
import router from '@/plugins/router';

export function setupPlugins(app: App): void {
  setupPinia(app);
  app.use(router);
}

export { pinia } from '@/plugins/pinia';
export { router } from '@/plugins/router';