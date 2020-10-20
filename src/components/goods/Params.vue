<template>
	<div>
		
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert :closable="false" show-icon
			    title="注意:只允许为第三级分类设置相关参数"
			    type="warning">
			</el-alert>
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类：</span>
					<!-- 选择商品分类的级联 -->
					<el-cascader
					    v-model="selectCateKeys"
					    :options="cateList"
					    :props="cateProps"
					    @change="handleChange"></el-cascader>
				</el-col>
			</el-row>
			<!-- tab标签页 -->
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<!-- 添加动态参数的面板 -->
				<el-tab-pane label="动态参数" name="many">
					<el-button :disabled="isBtnDisabled" @click="showAddDialog">添加参数</el-button>
					<!-- 动态参数表格 -->
					<el-table :data="manyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag v-for="(item,index) in scope.row.attr_vals" 
								:key="index" closable @close="handleClosed(index,scope.row)">{{item}}</el-tag>
								<!-- 输入框 -->
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<!-- 添加按钮 -->
								<el-button v-else class="button-new-tag" size="small" 
								@click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<!-- 索引 -->
						<el-table-column label="#" type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" size="mini"
								icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" size="mini"
								icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 添加静态参数的面板 -->
				<el-tab-pane label="静态参数" name="only">
					<el-button :disabled="isBtnDisabled" @click="showAddDialog">添加属性</el-button>
					<!-- 静态参数表格 -->
					<el-table :data="onlyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag v-for="(item,index) in scope.row.attr_vals" 
								:key="index" closable @close="handleClosed(index,scope.row)">{{item}}</el-tag>
								<!-- 输入框 -->
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<!-- 添加按钮 -->
								<el-button v-else class="button-new-tag" size="small" 
								@click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<!-- 索引 -->
						<el-table-column label="#" type="index"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" size="mini"
								icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" size="mini"
								icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 添加参数 -->
		<el-dialog
		  :title='"添加"+titleText'
		  :visible.sync="addDialogVisible"
		  width="50%" @close="addDialogClosed"
		  >
		  <!-- Content -->
		  <el-form ref="addFormRef" :model="addForm" label-width="100px" 
		  :rules="addFormReles" >
		    <el-form-item :label="titleText" prop="attr_name">
		      <el-input v-model="addForm.attr_name"></el-input>
		    </el-form-item>
		  </el-form>
		  <span slot="footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addParams">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 修改参数 -->
		<el-dialog
		  :title='"修改"+titleText'
		  :visible.sync="editDialogVisible"
		  width="50%" @close="editDialogClosed"
		  >
		  <!-- Content -->
		  <el-form ref="editFormRef" :model="editForm" label-width="100px" 
		  :rules="editFormReles" >
		    <el-form-item :label="titleText" prop="attr_name">
		      <el-input v-model="editForm.attr_name"></el-input>
		    </el-form-item>
		  </el-form>
		  <span slot="footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editParams">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				cateProps:{ 
					expandTrigger: 'hover' ,
					value:'cat_id',
					label:'cat_name',
					children:'children',
				},
				addFormReles:{
					attr_name:{
							required: true,
							message: '请输入分类的名称',
							trigger: 'blur'
						}
				},
				editFormReles:{
					attr_name:{
							required: true,
							message: '请输入分类的名称',
							trigger: 'blur'
						}
				},
				cateList:[],
				// 级联选择id
				selectCateKeys:[],
				// 当前标签页页面
				activeName:'many',
				manyTableData:[],
				onlyTableData:[],
				addDialogVisible:false,
				addForm:{
					attr_name:'',
				},
				editDialogVisible:false,
				editForm:{},
				// 文本框的输入隐藏
				inputVisible:false,
				// 输入的内容
				inputValue:'',
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			//获取商品分类的数据
			async getCateList(){
				const {
					data: res
				} = await this.$axios.request({
					url: "/categories",
					method: "get",
					params: {}
				});
				if (res.meta.status !== 200) {
					return this.$Message.error('获取商品失败！')
				}
				console.log(res.data)
				this.cateList=res.data;
			},
			//选中三级分类
			handleChange(){
				this.getParamsData()
			},
			//标签页切换
			handleClick(){
				this.getParamsData()
			},
			//获取参数列表
			async getParamsData(){
				//选中不是三级分类
				if (this.selectCateKeys.length!==3) {
					this.selectCateKeys=[]
					this.manyTableData=[]
					this.onlyTableData=[]
				}
				//console.log(this.selectCateKeys)
				//根据所选的ID和对应的面板获取数据
				const {
					data: res
				} = await this.$axios.request({
					url: `/categories/${this.cateID}/attributes`,
					method: "get",
					params: {
						sel:this.activeName
					}
				});
				if (res.meta.status !== 200) {
					return this.$Message.error('获取商品失败！')
				}
				res.data.forEach(item=>{
					//是否为空
					item.attr_vals=item.attr_vals?
					item.attr_vals.split(' '):[];
					// 每一个选项对应一个布尔值
					item.inputVisible=false
					// 和输入值
					item.inputValue=''
				})
				
				console.log(res.data)
				//this.cateList=res.data;
				if (this.activeName==='many') {
					this.manyTableData=res.data
				}else{
					this.onlyTableData=res.data
				}
			},
			//显示添加参数对话框
			showAddDialog(){
				this.addDialogVisible=true
			},
			//重置添加参数表单
			addDialogClosed(){
				this.$refs.addFormRef.resetFields()
			},
			//添加参数
			addParams(){
				this.$refs.addFormRef.validate(async (vaild) => {
					if (!vaild) return
					//发起添加用户的请求
					let {
						data: res
					} = await this.$axios.request({
						url: `categories/${this.cateID}/attributes`,
						method: 'post',
						data: {
							attr_name:this.addForm.attr_name,
							attr_sel:this.activeName
						}
					})
					if (res.meta.status !== 201) {
						return this.$Message.error('添加参数失败')
					}
					console.log(res.data);
					this.$Message.success('添加参数成功')
					this.addDialogVisible=false;
					this.getParamsData();
				})
			},
			//展示修改对话框
			async  showEditDialog(attr_id){
				 //查询当前参数的信息
				 const {
				 	data: res
				 } = await this.$axios.request({
				 	url: `categories/${this.cateID}/attributes/${attr_id}`,
				 	method: "get",
				 	params: {
						attr_sel:this.activeName
					}
				 });
				 if (res.meta.status !== 200) {
				 	return this.$Message.error('获取数据失败！')
				 }
				 this.editForm=res.data
				 this.editDialogVisible=true;
			 },
			 //重置添加参数表单
			 editDialogClosed(){
			 	this.$refs.editFormRef.resetFields()
			 },
			 //修改参数
			 editParams(){
				 this.$refs.editFormRef.validate(async (vaild) => {
				 	if (!vaild) return
				 	//发起修改用户的请求
				 	let {
				 		data: res
				 	} = await this.$axios.request({
				 		url: `categories/${this.cateID}/attributes/
						${this.editForm.attr_id}`,
				 		method: 'put',
				 		data: {
							attr_name:this.editForm.attr_name,
							attr_sel:this.activeName
				 		}
				 	})
				 	//console.log(res)
				 	if (res.meta.status !== 200) {
				 		return this.$Message.error('修改参数失败')
				 	}
				 	this.editDialogVisible = false;
				 	this.getParamsData()()
				 	this.$Message.success('更新参数信息成功')
				 })
			 },
			 //根据ID删除参数
			 async removeParams(attrid){
				 const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
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
				 	url: `categories/${this.cateID}/
					attributes/${attrid}`,
				 	method: 'delete',
				 })
				 if (res.meta.status !== 200) {
				 	return this.$Message.error('删除分类失败')
				 }
				 this.$Message.success('删除分类成功!')
				 this.getParamsData()
			 },
			 //添加标签
			 handleInputConfirm(row){
				 if (row.inputValue.trim().length===0) {
				 	row.inputValue=''
					row.inputVisible=false
					return
				 }
				 //没有return则输入了内容，则继续后续处理
				 row.attr_vals.push(row.inputValue)
				 row.inputValue=''
				 row.inputVisible=false
				 //发起修改用户的请求
				 this.saveAttrVals(row)
			 },
			 showInput(row){
				 row.inputVisible=true
				 //让文本框获得焦点
				 //$nextTick方法作用，就是当页面上元素被
				 //渲染之后，才会指定回调函数中的代码_=()
				 this.$nextTick(_ => {
				   this.$refs.saveTagInput.$refs.input.focus();
				 });
			},
			handleClosed(i,row){
				row.attr_vals.splice(i,1)
				this.saveAttrVals(row)
			},
			async saveAttrVals(row){
				let {
					data: res
				} = await this.$axios.request({
					url: `categories/${this.cateID}/attributes/${row.attr_id}`,
					method: 'put',
					data: {
						attr_name:row.attr_name,
						attr_sel:row.attr_sel,
						attr_vals:row.attr_vals.join(' ')
					}
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$Message.error('修改角色失败')
				}
			}
		},
		computed:{
			isBtnDisabled(){
				if(this.selectCateKeys.length!==3){
					return true
				}
				return false
			},
			cateID(){
				if( this.selectCateKeys.length===3){
					return this.selectCateKeys[this.selectCateKeys.length-1]
				}
				return null
			},
			//动态计算标题的文本
			titleText(){
				return (this.activeName==='many')?'动态参数':'静态属性';
			}
		}
	}
</script>

<style lang="less" scoped>
	.cat_opt{
		margin: 0.9375rem;
	}
	.el-tag{
		margin: 0.3125rem;
	}
	.input-new-tag{
		width: 6.25rem;
	}
</style>
