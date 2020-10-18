<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>

			<!-- 搜索与添加区域 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 用户列表区域 -->
			<el-table :data="userList" style="width: 100%" stripe border>
				<el-table-column type="index">
				</el-table-column>
				<el-table-column prop="username" label="姓名" width="180">
				</el-table-column>
				<el-table-column prop="email" label="邮箱" width="180">
				</el-table-column>
				<el-table-column prop="mobile" label="电话">
				</el-table-column>
				<el-table-column prop="role_name" label="角色">
				</el-table-column>
				<el-table-column prop="mg_state" label="状态">
					<template slot-scope="scope">
						<el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66"
						 inactive-color="#ff4949">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 修改 -->
						<el-tooltip effect="dark" content="修改" placement="top-end" enterable>
							<el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
						</el-tooltip>
						<!-- 删除 -->
						<el-tooltip effect="dark" content="删除" placement="top-end" enterable>
							<el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
						</el-tooltip>
						<!-- 分配角色按钮 -->
						<el-tooltip effect="dark" content="分配角色" placement="top-end" enterable>
							<el-button type="warning" icon="el-icon-setting"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加用户对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<!-- 内容主体区 -->
			<span>这是一段信息</span>
			<el-form :model="addForm" :rules="addFormrules" ref="addFormRefs" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<!-- 内容底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改用户的对话框 -->
		<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			<!-- 修改内容显示主体 -->
			<span>这是一段信息</span>
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			//验证邮箱
			var checkEmail = (rule, val, cb) => {
				const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
				if (regEmail.test(val)) {
					return cb()
				}
				cb(new Error('请输入合法的邮箱'))
			};
			//验证手机号
			var checkMobil = (rule, val, cb) => {
				const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
				if (regMobile.test(val)) {
					return cb()
				}
				cb(new Error('请输入合法的手机号'))
			}
			return {
				//获取用户列表的参数
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 2
				},
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				//添加用户规则校验对象
				addFormrules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户名的长度在3-10之间',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 16,
							message: '用户名的长度在6-16之间',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							validator: checkMobil,
							trigger: 'blur'
						}
					]

				},
				//修改用户规则校验对象
				editFormRules: {
					email: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							validator: checkMobil,
							trigger: 'blur'
						}
					]
				},
				total: 0,
				userList: [],
				//控制添加对话框
				addDialogVisible: false,
				//修改用户对话框的显示
				editDialogVisible: false,
				//查询到的用户信息对象
				editForm: {

				}
			}
		},
		created() {
			this.getUserList()
		},
		methods: {
			async getUserList() {
				const {
					data: res
				} = await this.$axios.request({
					url: "/users",
					method: "get",
					params: this.queryInfo
				});
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$Message.error(res.meta.msg)
				}
				this.userList = res.data.users
				this.total = res.data.total
			},
			handleSizeChange(newSize) {
				//每页数量change监听
				console.log(`每页 ${newSize} 条`);
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			handleCurrentChange(newPage) {
				console.log(`当前页: ${newPage}`);
				this.queryInfo.pagenum = newPage
				this.getUserList()
			},
			//监听switch开关的状态
			async userStateChanged(userinfo) {
				const {
					data: res
				} = await this.$axios.request({
					url: `users/${userinfo.id}/state/${userinfo.mg_state}`,
					method: "put"
				});
				if (res.meta.status !== 200) {
					userinfo.mg_state = !userinfo.mg_state
					return this.$Message.error('更新用户状态失败')
				}
				this.$Message.success('更新用户状态成功')
			},
			//重置添加弹框
			addDialogClosed() {
				this.$refs.addFormRefs.resetFields()
			},
			//点击按钮添加用户
			addUser() {
				this.$refs.addFormRefs.validate(async (vaild) => {
					if (!vaild) return
					//发起添加用户的请求
					let {
						data: res
					} = await this.$axios.request({
						url: '/users',
						method: 'post',
						data: this.addForm
					})
					if (res.meta.status !== 201) {
						return this.$Message.error('添加用户失败')
					}
					this.$Message.success('添加用户成功')
					this.addDialogVisible = false
					//重新获取用户列表
					this.getUserList()
				})
			},
			//展示编辑的对话框
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$axios.request({
					url: `/users/${id}`,
					method: "get",
					params: {}
				});
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$Message.error('添加用户失败')
				}
				this.editForm = res.data
				this.editDialogVisible = true
			},
			//重置修改弹框 重置验证结果
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			//提交修改用户信息操作
			editUserInfo() {
				this.$refs.editFormRef.validate(async (vaild) => {
					console.log(this.editForm)
					if (!vaild) return
					//发起修改用户的请求
					let {
						data: res
					} = await this.$axios.request({
						url: '/users/' + this.editForm.id,
						method: 'put',
						data: {
							emial: this.editForm.email,
							mobile: this.editForm.mobile
						}
					})
					//console.log(res)
					if (res.meta.status !== 200) {
						return this.$Message.error('修改用户失败')
					}
					this.editDialogVisible = false;
					this.getUserList()
					this.$Message.success('更新用户信息成功')
				})
			},
			//根据id删除用户信息
			async removeUserById(id) {
				const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch((err) => err);
				if (result !== 'confirm') {
					return this.$Message.info('已取消操作')
				}
				let {
					data: res
				} = await this.$axios.request({
					url: '/users/' + id,
					method: 'delete',
				})
				if (res.meta.status !== 200) {
					return this.$Message.error('删除用户失败')
				}
				this.$Message.success('删除用户成功!')
				this.getUserList();
			}
		}
	}
</script>

<style lang="less" scoped>
</style>
