import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
// import Home from '../components/Home'
// import Weclome from '../components/Weclome'
// import Users from '../components/user/Users'
// import rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'
// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
// import GoodsList from '../components/goods/List'
// import Add from '../components/goods/Add'
// import orders from '../components/order/Order'
// import Report from '../components/report/Report'

const Login = () => import(/* webpackChunkName: "login_home_weclome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login_home_weclome" */ '../components/Home')
const Weclome = () => import(/* webpackChunkName: "login_home_weclome" */ '../components/Weclome')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add')

const orders = () => import(/* webpackChunkName: "orders_Report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "orders_Report" */ '../components/report/Report')

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
      component:Rights
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
    {
      path:'/goods',
      component:GoodsList
    },
    {
      path:'/goods/add',
      component:Add
    },
    {
      path:'/orders',
      component:orders
    },
    {
      path:'/reports',
      component:Report
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
