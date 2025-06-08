// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'
import axios from 'axios';

axios.defaults.withCredentials = true;


const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app')

