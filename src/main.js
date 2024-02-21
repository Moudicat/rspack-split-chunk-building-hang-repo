import './style.css';
import { createApp } from 'vue';
import App from './App.vue';
import { Button } from 'vant';
import 'vant/lib/index.css';



createApp(App).use(Button).mount('#root');
