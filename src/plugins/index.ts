import type { App } from 'vue'
import { setupPinia } from '@/plugins/pinia'

export function setupPlugins(app: App): void {
  setupPinia(app)
}

export { pinia } from '@/plugins/pinia'