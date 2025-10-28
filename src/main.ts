import { createApp } from 'vue'
import { setupPlugins } from './plugins'
import App from './app.vue'
import './style.css'

const app = createApp(App)

setupPlugins(app)

app.mount('#app')
