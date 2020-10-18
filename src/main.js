import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios.js'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui';
import '@/assets/css/global.css';
let {Message,MessageBox}=ElementUI
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.prototype.$Message=Message
Vue.prototype.$confirm=MessageBox.confirm
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
