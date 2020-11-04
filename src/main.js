import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/global.css'

Vue.prototype.$http = axios


// ��������ӿڸ�·��
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// ����������
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // ������return config
  return config
  
})
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
