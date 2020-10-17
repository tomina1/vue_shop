<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../assets/logo.png" />
			</div>
			<el-form ref="form" :rules="loginFormRules" :model="loginForm" class="login_form">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom" />
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" />
				</el-form-item>
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="infor" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loginForm: {
					username: 'admin',
					password: '123456'
				},
				loginFormRules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '长度在 6 到 15 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			reset() {
				this.$refs.form.resetFields()
			},
			login() {
				this.$refs.form.validate(async (vaild) => {
					if (!vaild) {
						return
					}
					let {
						data: res
					} = await this.$axios.request({
						url: '/login',
						method: 'post',
						data: this.loginForm
					})
					console.log(res)
					if (res.meta.status !== 200) {
						this.$Message.error('账号或密码错误，登录失败')
						return
					}
					this.$Message.success('登陆成功！')
					window.sessionStorage.setItem('token', res.data.token)
					this.$router.push('/home');
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.login_form {
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 0 0.625rem;
		box-sizing: border-box;

		.btns {
			display: flex;
			justify-content: flex-end;
			padding: 0 1.25rem;
		}
	}

	.login_container {
		background-color: #2b4b6b;
		height: 100%;

		.login_box {
			width: 28.125rem;
			height: 18.75rem;
			background-color: #fff;
			border-radius: 1.5rem;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			.avatar_box {
				position: absolute;
				left: 50%;
				transform: translate(-50%, -50%);
				height: 8.125rem;
				width: 8.125rem;
				border-radius: 50%;
				border: 0.0625rem solid #eee;
				padding: 1.25rem;
				box-shadow: 0 0 0.625rem #ddd;
				background-color: #fff;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background-color: #eee;
				}
			}
		}
	}
</style>
