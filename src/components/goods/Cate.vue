<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button @click="showAddCateDialog" type="primary">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 表格 -->
			<tree-table class="treeTable" :data="cateList" :columns="columns"
			:selection-type="false" :expand-type="false" show-index
			index-text="#" border :show-row-hover="false">
				<template #isok="scope">
					<i class="el-icon-success" style="color: lightgreen;"
					v-if="scope.row.cat_deleted===false"></i>
					<i class="el-icon-error" v-else></i>
				</template>
				<template #order="scope">
					<el-tag size="mini" 
					v-if="scope.row.cat_level===0"
					>一级</el-tag>
					<el-tag type="success" size="mini"
					v-else-if="scope.row.cat_level===1">二级</el-tag>
					<el-tag type="warning" size="mini" v-else>三级</el-tag>
				</template>
				<template #opt="scope">
					<el-button type="primary" icon="el-icon-edit"
					size="mini">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete"
					size="mini" @click="deleteCateItem(scope.row.cat_id)">删除</el-button>
				</template>
			</tree-table>
			<!-- 分页区域 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[3, 5, 10, 15]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
		</el-card>
		
		<!-- 添加分类的对话框 -->
		<el-dialog
		  title="添加分类"
		  :visible.sync="addCateDialogVisible"
		  width="50%"
		  @close="addCateDialogClosed">
		  <el-form ref="addCateFormRef" :model="addCateForm" 
		  label-width="100px" v-model="addCateForm" :rules="addCateFormRules">
		    <el-form-item label="分类名称:" prop="cat_name">
		      <el-input v-model="addCateForm.cat_name"></el-input>
		    </el-form-item>
			<el-form-item label="父级分类:">
				<!-- options指定数据源 -->
				<el-cascader clearable change-on-select
				    v-model="selectKeys"
				    :options="parentCateList"
				    :props="cascaderProps"
				    @change="parentCateChange"></el-cascader>
			</el-form-item>
			</el-form>
		  <span slot="footer">
		    <el-button @click="addCateDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCate">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//查询条件
				queryInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				columns:[
					{
						label:'分类名称',
						prop:'cat_name'
					},
					{
						label:'是否有效',
						prop:'',
						//定义当前列为模板列
						type:'template',
						template:'isok'
					},{
						label:'排序',
						prop:'cat_level',
						//定义当前列为模板列
						type:'template',
						template:'order'
					},{
						label:'操作',
						//定义当前列为模板列
						type:'template',
						template:'opt'
					}
				],
				//表单验证规则对象
				addCateFormRules:{
					cat_name:[
						{
							required: true,
							message: '请输入分类的名称',
							trigger: 'blur'
						}]
					
				},
				//指定级联选择器的配置对象
				cascaderProps:{
					expandTrigger: 'hover',
					value:'cat_id',
					label:'cat_name',
					children:'children',
					//取消父子节点关联
					checkStrictly: true
				},
				//商品分类的数据列表，默认为空
				cateList:[],
				//父级分类的列表
				parentCateList:[],
				total:0,
				addCateDialogVisible:false,
				//添加分类的表单名称
				addCateForm:{
					cat_pid:0,//父级分类id
					cat_name:'',
					cat_level:0//默认等级为一
				},
				//选中的父级分类的ID数
				selectKeys:[]

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
					params: this.queryInfo
				});
				if (res.meta.status !== 200) {
					return this.$Message.error('获取商品失败！')
				}
				console.log(res.data)
				this.cateList=res.data.result;
				this.total=res.data.total
			},
			//监听pagesize改变的事件
			handleSizeChange(newSize){
				this.queryInfo.pagesize=newSize
				this.getCateList()
			},
			//当前页码值发生变化
			handleCurrentChange(newPage){
				this.queryInfo.pagenum=newPage
				this.getCateList()
			},
			//显示添加分类的对话框
			showAddCateDialog(){
				this.getParentList()
				this.addCateDialogVisible=true
			},
			async getParentList(){
				const {
					data: res
				} = await this.$axios.request({
					url: "/categories",
					method: "get",
					params: {
						type:2
						}
				});
				if (res.meta.status !== 200) {
					return this.$Message.error('获取父级分类失败！')
				}
				console.log(res.data)
				this.parentCateList=res.data
			},
			parentCateChange(){
				//大于0选中，不然就是没选中
				if(this.selectKeys.length>0){
					this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
					//当前分类的等级赋值
					this.addCateForm.cat_level=this.selectKeys.length
					return
				}else{
					this.addCateForm.cat_pid=0
					this.addCateForm.cat_level=0
				}
			},
			//监听添加分类对话框的关闭事件
			addCateDialogClosed(){
				this.$refs.addCateFormRef.resetFields()
				this.selectKeys=[]
				this.addCateForm.cat_pid=0
				this.addCateForm.cat_level=0
			},
			//添加分类
			addCate(){
				this.$refs.addCateFormRef.validate(async (vaild) => {
					if (!vaild) return
					//发起添加用户的请求
					let {
						data: res
					} = await this.$axios.request({
						url: '/categories',
						method: 'post',
						data: this.addCateForm
					})
					if (res.meta.status !== 201) {
						return this.$Message.error('添加分类失败')
					}
					console.log(res.data)
					this.$Message.success('添加分类成功')
					// if(this.addCateForm.cat_level==0){
					// 	this.cateList.push(res.data);
					// }else{
					// 	this.catePush(this.cateList,this.addCateForm.cat_pid,res.data)
					// }
					this.getCateList()
					this.addCateDialogVisible=false
				})
			},
			//删除分类
			async deleteCateItem(id){
				const result = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
					url: '/categories/' + id,
					method: 'delete',
				})
				if (res.meta.status !== 200) {
					return this.$Message.error('删除分类失败')
				}
				this.$Message.success('删除分类成功!')
				this.getCateList();
			}
			// //递归加入参数
			// catePush(data,id,addData){
			// 	data.forEach(item=>{
			// 		if(item.children){
			// 			return this.catePush(item.children,id,addData)
			// 		}
			// 		if (item.cat_id==id) {
			// 			item.children=[]
			// 			return item.children.push(addData)
			// 		}

			// 	})
			// }
		}
	}
</script>

<style lang="less" scoped>
	.treeTable{
		margin-top: 0.9375rem;
	}
	.el-cascader{
		width: 100%;
	}
</style>
