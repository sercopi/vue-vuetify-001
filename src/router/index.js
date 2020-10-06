import Vue from 'vue';
import VueRouter from 'vue-router';
import Calendar from '@/components/Calendar';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Calendar
  }
];

const router = new VueRouter({
  routes
});

export default router;
