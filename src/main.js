import './style.css';
import { createApp } from 'vue';
import App from './App.vue';
import { Button } from 'vant';



createApp(App).use(manticore).use(Button).mount('#root');
