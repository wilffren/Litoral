import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css';

// Crear instancia de Vue
const app = createApp(App);

// Crear instancia de Pinia (gestión de estado)
const pinia = createPinia();

// Usar plugins
app.use(pinia);
app.use(router);

// Montar la aplicación
app.mount('#app');