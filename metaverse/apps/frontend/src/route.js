import { createRouter, createWebHistory } from 'vue-router';
import Arena from './Arena.vue';

const routes = [
  {
    path: '/arena',
    component: Arena,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;