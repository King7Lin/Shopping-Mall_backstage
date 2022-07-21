import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Weclome from '../components/Weclome'
import Users from '../components/user/Users'
import rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/weclome',
    children: [{
      path: '/weclome',
      component: Weclome
    },{
      path:'/Users',
      component:Users
    },{
      path:'/rights',
      component:rights
    },
    {
      path:'/Roles',
      component:Roles
    },
    {
      path:'/categories',
      component:Cate
    },
    {
      path:'/Params',
      component:Params
    },
  ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  const tokenStr = window.sessionStorage.getItem('token')

  if (!tokenStr) return next('login')

  next()
})

export default router
