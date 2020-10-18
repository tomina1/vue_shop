import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios.js'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui';
import '@/assets/css/global.css';
<<<<<<< HEAD
let {Message}=ElementUI
=======
let {Message,MessageBox}=ElementUI
>>>>>>> login
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.prototype.$Message=Message
<<<<<<< HEAD
=======
Vue.prototype.$confirm=MessageBox.confirm
>>>>>>> login
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
