import Vue from 'vue'
import VueRouter from 'vue-router'
import {auth} from '../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/crear-usuarios',
    name: 'CrearUsuarios',
    component: () => import('../views/CrearUsuarios.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/empresas',
    name: 'Empresas',
    component: () => import('../views/Tablero.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/crear-empresa',
    name: 'CrearEmpresa',
    component: () => import('../views/CrearEmpresa.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/editar-empresa/:id',
    name: 'EditarEmpresa',
    component: () => import('../views/EditarEmpresa.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/legislacion/leyes/:id',
    name: 'Tareas',
    component: () => import('../views/Leyes.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/legislacion/agregar/ley/:id',
    name: 'CrearLey',
    component: () => import('../views/CrearLey.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/legislacion/editar/ley/:id',
    name: 'EditarLey',
    component: () => import('../views/EditarLey.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/leyes',
    name: 'Leyes',
    component: () => import('../views/Leyes.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/grupos',
    name: 'Grupos',
    component: () => import('../views/Grupos.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/crear-grupos',
    name: 'CrearGrupos',
    component: () => import('../views/CrearGrupos.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: () => import('../views/Reportes.vue'),
    meta: {requiresAuth: true}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (user) {
      next()
    }else{
      next({name:'Login'})
    }
  } else {
    next()
  }
})

export default router
