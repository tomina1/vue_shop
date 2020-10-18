<template>
	<div class="home_container">
	<el-container class="home_container">
		<!-- 主体头部区域 -->
		<el-header>
			<div>
				<img src="../assets/logo.png" />
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="outline">login
			</el-button>
		</el-header>
		<!-- 页面主体区域 -->
		<el-container>
			<el-aside :width="isCollapse?'64px':'200px'">
				<div class="toggle-button" @click="toggleCollapse">|||</div>
				<el-menu text-color="#fff" background-color="#333744" :collapse-transition="false"
				active-text-color="#ffd04b" router unique-opened :collapse="isCollapse" :default-active="activePath">
					<el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
						<template slot="title">
							<i :class="iconlist[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>
						<el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
							<template #title>
								<i class="el-icon-menu"></i>
								<span>{{subItem.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<!-- 路由占位符 -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [],
				iconlist:{
					'125':'el-icon-s-custom',
					'103':'el-icon-orange',
					'101':'el-icon-stopwatch',
					'102':'el-icon-chat-line-round',
					'145':'el-icon-notebook-2'
				},
				isCollapse:false,
				//被激活的连接地址
				activePath:''
			}
		},
		methods: {
			outline() {
				sessionStorage.removeItem('token')
				this.$router.push('/login');
			},
			async getMenuList() {
				const {
					data: res
				} = await this.$axios.request({
					url: "/menus",
					method: "get",
					params: {}
				});
				if (res.meta.status !== 200) {
					return this.$Message.error(res.meta.msg)
				}
				this.menuList = res.data
				// console.log(res)
			},
			toggleCollapse(){
				//切换折叠
				this.isCollapse=!this.isCollapse
			},
			saveNavState(activePath){
				//保存连接的激活状态
				sessionStorage.setItem('activePath',activePath)
			}
		},
		created() {
			this.getMenuList()
			this.activePath=sessionStorage.getItem('activePath')
		}
	}
</script>

<style lang="less" scoped>
	.home_container {
		height: 100%;
	}

	.el-header {
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #fff;

		>div {
			display: flex;
			align-items: center;

			>span {
				margin-left: 1.25rem;
			}
		}

		img {
			width: 3.125rem;
			height: 3.125rem;
		}
	}

	.el-aside {
		background-color: #333744;
	}

	.el-main {
		background-color: #eaedf1;
	}
	.el-menu{
		border-right: 0;
	}
	.toggle-button{
		background-color: #4A5064;
		font-size: 0.625rem;
		line-height: 1.5rem;
		color: #fff;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>
