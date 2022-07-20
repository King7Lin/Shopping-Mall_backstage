import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import {
  Message,
  MessageBox 
} from 'element-ui'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})
Vue.prototype.$http = axios

Vue.prototype.$message = Message
Vue.prototype.$confifrm = MessageBox

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
