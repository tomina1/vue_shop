import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios.js'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui';
import '@/assets/css/global.css';
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//全局注册富文本
Vue.use(VueQuillEditor)

import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';
Vue.use(VueAreaLinkage)

let {Message,MessageBox}=ElementUI
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.prototype.$Message=Message
Vue.prototype.$confirm=MessageBox.confirm
Vue.component('tree-table',TreeTable)
Vue.filter('dataFormat',function(originVal){
	const dt=new Date(originVal)
	const y=dt.getFullYear()
	//不足多少位用什么来填充
	const m=(dt.getMonth()+1+'').padStart(2,'0')
	const d=(dt.getDay()+'').padStart(2,'0')
	
	const hh=(dt.getHours()+'').padStart(2,'0')
	const mm=(dt.getMinutes()+'').padStart(2,'0')
	const ss=(dt.getSeconds()+'').padStart(2,'0')
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
