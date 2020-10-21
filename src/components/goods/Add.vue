<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 提示区域 -->
			<el-alert
			    title="消息提示的文案" center show-icon
			    type="info" :closable="false">
			</el-alert>
			<!-- 步骤条区域 -->
			<el-steps :space="200" :active="activeIndex-0" 
			finish-status="success" align-center>
			    <el-step title="基本信息"></el-step>
			    <el-step title="商品参数"></el-step>
			    <el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<!-- 标签页区域 -->
			<el-form :model="addForm" :rules="addRules" 
			ref="addRuleForm" label-width="100px" 
			label-position="top">
				<el-tabs v-model.Number="activeIndex" @tab-click="tabClick"
				tab-position="left" :before-leave="beforeTabLeave">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight"  type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addForm.goods_number"  type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader
							    v-model="addForm.goods_cat"
							    :options="cateList"
							    :props="cateProps"
							    @change="handleChange"></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<!-- 渲染表单的Item -->
						<el-form-item :label="item.attr_name" v-for="item in manyTableData" 
						:key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
							    <el-checkbox :label="inItem" :key="inItem"
								v-for="inItem in item.attr_vals" border></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name" 
						v-for="item in onlyTableData" 
						:key="item.attr_id">
							<el-input v-model="item.attr_vals[0]"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- Action图片要上传的api地址 -->
						<el-upload :headers="headersObj"
						  :action="updateURL"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  :on-success="handleSuccess"
						  list-type="picture">
						  <el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<!-- 富文本编辑器组件 -->
						<quill-editor v-model="addForm.goods_introduce"/>
						<!-- 添加商品的按钮 -->
						<el-button @click="add" type="primary" 
						class="btnAdd">添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
		<!-- 图片预览弹框 -->
		<el-dialog
		  title="图片预览"
		  :visible.sync="previewDialogVisible"
		  width="50%">
		  <img :src="previewFilePath" alt="" class="previewImg"/>
		</el-dialog>
	</div>
</template>

<script>
	import _ from 'lodash'
	export default {
		data() {
			return {
				//添加表单验证
				addRules:{
					goods_name:{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					},
					goods_price:{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur'
					},
					goods_weight:{
						required: true,
						message: '请输入商品重量',
						trigger: 'blur'
					},
					goods_number:{
						required: true,
						message: '请输入商品数量',
						trigger: 'blur'
					},
					goods_cat:{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					},
				},
				//级联选择器设置
				cateProps:{ 
					label:'cat_name',
					value:'cat_id',
					children:'children',
					expandTrigger: 'hover' ,
				},
				//上传图片的url
				updateURL:'https://www.liulongbin.top:8888/api/private/v1/upload',
				// 请求头对象
				headersObj:{
					Authorization:sessionStorage.getItem('token')
				},
				activeIndex:0,
				//商品分类
				cateList:[],
				//动态参数列表
				manyTableData:[],
				//静态参数列表
				onlyTableData:[],
				//添加表单数据对象
				addForm:{
					goods_name:'',
					goods_price:0,
					goods_weight:0,
					goods_number:0,
					goods_cat:[],
					//图片的数组
					pics:[],
					//商品的详情描述
					goods_introduce:'',
					attrs:[]
				},
				previewDialogVisible:false,
				previewFilePath:''
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			//级联选择器
			handleChange(){
				if (this.addForm.goods_cat.length!==3) {
					this.addForm.goods_cat=[]
				}
			},
			beforeTabLeave(active,oldActive){
				if (oldActive==='0' &&
				this.addForm.goods_cat.length!==3) {
					this.$Message.error('请先选择商品分类！')
					return false
				}
			},
			tabClick(){
				if (this.activeIndex==='1') {
					this.getParamsData('many')
				}else if (this.activeIndex==='2') {
					this.getParamsData('only')
				}
			},
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
				this.cateList=res.data;
				//this.total=res.data.total
			},
			//根据所选的ID和对应的面板获取数据
			async getParamsData(type){
				const {
					data: res
				} = await this.$axios.request({
					url: `/categories/${this.cateID}/attributes`,
					method: "get",
					params: {
						sel:type
					}
				});
				if (res.meta.status !== 200) {
					return this.$Message.error('获取商品失败！')
				}
				res.data.forEach(item=>{
					//是否为空
					item.attr_vals=item.attr_vals?
					item.attr_vals.split(','):[];
					// 每一个选项对应一个布尔值
					item.inputVisible=false
					// 和输入值
					item.inputValue=''
				})
				if (type==='many') {
					this.manyTableData=res.data
				}else{
					this.onlyTableData=res.data
				}
			},
			// 图片预览事件
			handlePreview(file){
				this.previewFilePath=
				file.response.data.url;
				this.previewDialogVisible=true
			},
			//上传图片成功
			handleSuccess(response, file, fileList){
				//1.拼接一个图片信息对象
				const picInfo={
					pic:response.data.tmp_path
				}
				//2.push到数组中
				this.addForm.pics.push(picInfo)
			},
			//处理移除图片的操作
			handleRemove(file, fileList){
				//临时路径
				const filePath=
				file.response.data.tmp_path;
				//找到index
				const i=
				this.addForm.pics.findIndex(x=>{
					x.pic===filePath
				})
				//移除splice
				this.addForm.pics.splice(i,1)
			},
			//添加商品事件
			add(){
				this.$refs.addRuleForm.validate(async (vaild) => {
					if (!vaild) {
						return this.$Message.error('请填写必要的表单项')
					}
					//发起添加的请求
					const form=_.cloneDeep(this.addForm)
					form.goods_cat=
					form.goods_cat.join(',');
					//处理动态参数
					this.manyTableData.forEach(item=>{
						const newInfo={
							attr_id:item.attr_id,
							attr_value:item.attr_vals.join(' ')
						}
						this.addForm.attrs.push(newInfo)
					})
					//处理静态属性
					this.onlyTableData.forEach(item=>{
						const newInfo={
							attr_id:item.attr_id,
							attr_value:item.attr_vals.join(' ')
						}
						this.addForm.attrs.push(newInfo)
					})
					form.attrs=this.addForm.attrs
					//发起请求，商品名必须是唯一的
					let {
						data: res
					} = await this.$axios.request({
						url: `goods`,
						method: 'post',
						data: form
					})
					if (res.meta.status !== 201) {
						return this.$Message.error('添加商品失败,请检查数据')
					}
					this.$Message.success('添加商品成功');
					this.$router.push('/goods')
				})
			},
		},
		computed:{
			cateID(){
				if( this.addForm.goods_cat.length===3){
					return this.addForm.goods_cat[this.addForm.goods_cat.length-1]
				}
				return null
			},
		}
		
	}
</script>

<style lang="less" scoped>
	.el-steps{
		margin: 1.5625rem 0;
	}
	.el-checkbox{
		margin: 0 0.3125rem 0 0 !important;
	}
	.previewImg{
		width: 100%;
	}
	.btnAdd{
		margin-top: 0.9375rem;
	}
</style>
