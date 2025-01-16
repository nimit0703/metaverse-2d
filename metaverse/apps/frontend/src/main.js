import { createApp } from 'vue';

//libreries
import 'bootstrap'

//styles
import 'bootstrap/dist/css/bootstrap.min.css';

//files
import App from './App.vue';
import router from './route';

//creating app
const app = createApp(App);

//adding plugins
app.use(router);

app.mount('#app');