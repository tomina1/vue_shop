import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login' //重定向
	},
	{
		path: '/login',
		component: ()=>import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue')
	},
	{
		path: '/home',
		component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/home.vue'),
		redirect:'/welcome',//到这个页面重定向到welcome页面
		children:[
			{path:'/welcome',component:()=>import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome.vue')},
			
			{path:'/users',component:()=> import(/* webpackChunkName: "users_rights_roles" */ '@/components/user/User.vue')},
			{path:'/rights',component:()=>import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Rights.vue')},
			{path:'/roles',component:()=>import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Roles.vue')},
			
			{path:'/categories',component:()=>import(/* webpackChunkName: "categories_params" */ '@/components/goods/Cate.vue')},
			{path:'/params',component:()=>import(/* webpackChunkName: "categories_params" */ '@/components/goods/Params.vue')},
			
			{path:'/goods',component:()=>import(/* webpackChunkName: "goods_goods_add" */ '@/components/goods/List.vue')},
			{path:'/goods/add',component:()=>import(/* webpackChunkName: "goods_goods_add" */ '@/components/goods/Add.vue')},
			
			{path:'/orders',component:()=>import(/* webpackChunkName: "orders_reports" */ '@/components/order/Order.vue')},
			{path:'/reports',component:()=>import(/* webpackChunkName: "orders_reports" */ '@/components/report/report.vue')}
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
