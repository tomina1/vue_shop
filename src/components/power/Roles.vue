<template>
	<div class="roles_container">
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<!-- 添加角色按钮 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="showaddRolesDialog">添加角色</el-button>
				</el-col>
			</el-row>
			<el-table :data="rolesList" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom',index1===0?'bdtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row,item3.id)">{{item1.authName}} </el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 渲染二、三级权限 -->
							<el-col :span="19">
								<el-row :class="[index2===0?'':'bdtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
									<!-- 二级 -->
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}} </el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<!-- 三级 -->
									<el-col :span="18">
										<el-tag v-for="(item3,index3) in item2.children" :key="item3.id"
										 type="warning" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<!-- 索引列 -->
				<el-table-column type="index"></el-table-column>
				<el-table-column  label="角色名称" prop="roleName"></el-table-column>
				<el-table-column  label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column  label="操作" width="300px">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
						<el-button size="mini" @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 添加角色对话框 -->
		<el-dialog
		  title="添加角色"
		  :visible.sync="addRolesDialogVisible"
		  width="50%" @close="addDialogClosed">
		  <!-- 这是内容 -->
		<el-form ref="addRoleFormRef" :rules="addFormrules" :model="addRoleInfo" label-width="80px">
		    <el-form-item label="角色名称" prop="roleName">
		      <el-input v-model="addRoleInfo.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
			  <el-input v-model="addRoleInfo.roleDesc"></el-input>
			</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="addRolesDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRole">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑角色弹框 -->
		<el-dialog
		  title="编辑角色"
		  :visible.sync="editRolesDialogVisible"
		  width="50%" @close="addDialogClosed">
		  <!-- 这是内容 -->
		<el-form ref="editRoleFormRef" :rules="editFormRules" :model="editRoleInfo" label-width="80px">
		    <el-form-item label="角色名称" prop="roleName">
		      <el-input v-model="editRoleInfo.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
			  <el-input v-model="editRoleInfo.roleDesc"></el-input>
			</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="editRolesDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editRole">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 分配权限弹框 -->
		<el-dialog
		  title="分配权限"
		  :visible.sync="SetRightDialogVisible"
		  width="50%"
		  @close="setRightDialogClosed"
		  >
		  <el-tree ref="treeRef" :data="rightsList" :props="treeProps" default-expand-all
		  @node-click="handleNodeClick" node-key="id" show-checkbox
		  :default-checked-keys="defKeys"></el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="SetRightDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="alotRights">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				addFormrules:{
					roleName:[
						{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						}
					],
					roleDesc:[
						{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						}
					]
				},
				editFormRules:{
					roleName:[
						{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						}
					]},
				rolesList:[],
				SetRightDialogVisible:false,
				addRolesDialogVisible:false,
				editRolesDialogVisible:false,
				rightsList:[],
				// 树形控件的属性绑定对象
				treeProps:{
					label:'authName',
					children:'children'
				},
				//默认展开的eky数组(id)
				defKeys:[],
				addRoleInfo:{},
				editRoleInfo:{},
				// 当前即将分配权限的ID
				roleID:''
			}
		},
		created() {
			this.getRolesList()
		},
		methods:{
			//显示添加角色对话框
			showaddRolesDialog(){
				this.addRolesDialogVisible=true
			},
			//添加角色
			addRole(){
				this.$refs.addRoleFormRef.validate(async (vaild) => {
					if (!vaild) return
					//发起添加用户的请求
					let {
						data: res
					} = await this.$axios.request({
						url: '/roles',
						method: 'post',
						data: this.addRoleInfo
					})
					if (res.meta.status !== 201) {
						return this.$Message.error('添加用户失败')
					}
					this.$Message.success('添加用户成功')
					this.addRolesDialogVisible = false
					//重新获取用户列表
					this.rolesList.push(res.data)
				})
			},
			//重置添加角色弹框
			addDialogClosed(){
				this.$refs.addRoleFormRef.resetFields()
			},
			//删除角色
			async removeRoleById(id){
				const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
					url: '/roles/' + id,
					method: 'delete',
				})
				if (res.meta.status !== 200) {
					return this.$Message.error('删除用户失败')
				}
				this.$Message.success('删除用户成功!')
				this.getRolesList()
			},
			//显示编辑弹框
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$axios.request({
					url: `/roles/${id}`,
					method: "get",
					params: {}
				});
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$Message.error('添加用户失败')
				}
				this.editRoleInfo = res.data
				this.editRolesDialogVisible = true
			},
			//编辑角色
			editRole(){
				this.$refs.editRoleFormRef.validate(async (vaild) => {
					if (!vaild) return
					//发起修改用户的请求
					let {
						data: res
					} = await this.$axios.request({
						url: '/roles/' + this.editRoleInfo.roleId,
						method: 'put',
						data: {
							roleName: this.editRoleInfo.roleName,
							roleDesc: this.editRoleInfo.roleDesc
						}
					})
					//console.log(res)
					if (res.meta.status !== 200) {
						return this.$Message.error('修改角色失败')
					}
					this.editRolesDialogVisible = false;
					this.getRolesList()
					this.$Message.success('更新角色信息成功')
				})
			},
			//重置编辑对话框
			addDialogClosed(){
				this.$refs.editRoleFormRef.resetFields()
			},
			async getRolesList() {
				const {data:res} = await this.$axios.request({
				    url: "/roles",
				    method: "get",
				    params: {  
				    }
				 });
				 if (res.meta.status !== 200) {
				 	return this.$Message.error(res.meta.msg)
				 }
				 this.rolesList=res.data
			},
			//根据id删除对应的权限
			async removeRightById(role,id){
				const result = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch((err) => err);
				if (result !== 'confirm') {
					return this.$Message.info('已取消操作')
				}
				console.log('ok')
				let {
					data: res
				} = await this.$axios.request({
					url: `roles/${role.id}/rights/${id}`,
					method: 'delete',
				})
				if (res.meta.status !== 200) {
					return this.$Message.error('删除用户失败')
				}
				this.$Message.success('删除用户成功!')
				//this.getRolesList()
				role.children=res.data
			},
			//展示分配权限的
			async showSetRightDialog(role){
				this.roleID=role.id
				// 获取所有权限树
				const {data:res} = await this.$axios.request({
				    url: "/rights/tree",
				    method: "get",
				    params: {  
				    }
				 });
				 if (res.meta.status !== 200) {
				 	return this.$Message.error('获取数据失败')
				 }
				 this.rightsList=res.data
				 this.getLeafKeys(role,this.defKeys)
				this.SetRightDialogVisible=true	
			},
			//通过递归的形式，获取角色下所有
			//三级菜单的id，并保存到defkeys数组里
			getLeafKeys(node,arr){
				if(!node.children){
					return arr.push(node.id)
				}
				node.children.forEach(item=>{
					this.getLeafKeys(item,arr)
				})
			},
			//监听权限对话框的关闭事件
			setRightDialogClosed(){
				this.defKeys=[]
			},
			handleNodeClick(){},
			//点击为角色分配权限
			async alotRights(){
				const keys=[
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				const idStr=keys.join(',')
				let {data:res}= await this.$axios.request({
				    url:`/roles/${this.roleID}/rights`,
				    method:'post',
				    data:{
						rids:idStr
					}
				})
				if (res.meta.status !== 200) {
					return this.$Message.error('分配权限失败')
				}
				this.$Message.success('分配权限成功')
				this.getRolesList()
				this.SetRightDialogVisible=false
			}
		}
		
	}
</script>

<style lang="less" scoped>
	.roles_container{
		
	}
	.el-tag{
		margin: 0.4375rem;
	}
	.bdtop{
		border-top: 1px solid #eee;
	}
	.bdbottom{
		border-bottom: 1px solid #eee;
	}
	.vcenter{
		display: flex;
		align-items: center;
	}
</style>
