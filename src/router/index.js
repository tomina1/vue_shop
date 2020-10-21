import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login' //重定向
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		component: () => import('@/components/home.vue'),
		component: () => import('@/components/home.vue'),
		redirect:'/welcome',//到这个页面重定向到welcome页面
		children:[
			{path:'/welcome',component:()=> import('@/components/Welcome.vue')},
			{path:'/users',component:()=> import('@/components/user/User.vue')},
			{path:'/rights',component:()=>import('@/components/power/Rights.vue')},
			{path:'/roles',component:()=>import('@/components/power/Roles.vue')},
			{path:'/categories',component:()=>import('@/components/goods/Cate.vue')},
			{path:'/params',component:()=>import('@/components/goods/Params.vue')},
			{path:'/goods',component:()=>import('@/components/goods/List.vue')},
			{path:'/goods/add',component:()=>import('@/components/goods/Add.vue')},
			{path:'/orders',component:()=>import('@/components/order/Order.vue')},
			{path:'/reports',component:()=>import('@/components/report/report.vue')}
		]
	}
]

const router = new VueRouter({
	routes
})
router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next()
	if (!window.sessionStorage.getItem('token')) {
		return next('/login')
	}
	next();
})

export default router
