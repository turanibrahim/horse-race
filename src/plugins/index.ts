import type { App } from 'vue'
import { setupPinia } from './pinia'

export function setupPlugins(app: App): void {
  setupPinia(app)
}

export { pinia } from './pinia'