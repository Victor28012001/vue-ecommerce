// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'
import axios from 'axios';

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "https://api.defonix.com"; // Optional
// axios.defaults.headers.common['Accept'] = 'application/json';

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app')

