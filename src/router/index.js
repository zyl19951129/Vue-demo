import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Welcome from '../views/Welcome.vue';
import Users from '../views/Users.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/users', name: 'Users', component: Users },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    if (localStorage.getItem('token')) {
      return next();
    }
    next('/');
  }
});
export default router;
