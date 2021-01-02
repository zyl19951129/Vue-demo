import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Welcome from '../views/Welcome.vue';
import Users from '../views/Users.vue';
import Roles from '../views/Roles.vue';
import Rights from '../views/Rights.vue';
import Params from '../views/Params.vue';

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
      { path: '/roles', name: 'Roles', component: Roles },
      { path: '/rights', name: 'Rights', component: Rights },
      { path: '/params', name: 'Params', component: Params },
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
