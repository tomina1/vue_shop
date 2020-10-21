<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" 
					clearable @clear="getCateList">
					    <el-button slot="append" icon="el-icon-search"
						@click="getCateList"></el-button>
					 </el-input>
				</el-col>
				<el-col :span="4">
					<el-button @click="goAddGoodsPage" 
					type="primary">添加商品</el-button>
				</el-col>
			</el-row>
			<!-- table表格区域 -->
			<el-table
			    :data="goodsList"
			    border stripe
			    style="width: 100%">
				<!-- 序列 -->
				<el-table-column type="index" label="#"/>
			    <el-table-column
			      prop="goods_name"
			      label="商品名称">
			    </el-table-column>
			    <el-table-column
			      prop="goods_price"
			      label="商品价格(元)"
			      width="95px">
			    </el-table-column>
			    <el-table-column
			      prop="goods_weight"
			      label="商品重量"
				  width="70px">
			    </el-table-column>
				<el-table-column
				  prop="add_time"
				  label="创建时间"
				  width="140px">
				  <template slot-scope="scope">
					  {{scope.row.add_time | dataFormat}}
				  </template>
				</el-table-column>
				<el-table-column
				  label="操作"
				  width="130px">
				  <template slot-scope="scope">
					<el-button type="primary" size="mini" 
					icon="el-icon-edit"/>
					<el-button type="danger" size="mini" 
					icon="el-icon-delete" @click="removeByID(scope.row.goods_id)"/>
				  </template>
				</el-table-column>
			  </el-table>
			  <!-- 分页 -->
			  <el-pagination background
			        @size-change="handleSizeChange"
			        @current-change="handleCurrentChange"
			        :current-page="queryInfo.pagenum"
			        :page-sizes="[3, 5, 10, 15]"
			        :page-size="queryInfo.pagesize"
			        layout="total, sizes, prev, pager, next, jumper"
			        :total="total">
			    </el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 查询参数
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:5
				},
				total:0,
				goodsList:[]
			}
		},
		methods:{
			//查询商品列表
			async getCateList(){
				const {
					data: res
				} = await this.$axios.request({
					url: "/goods",
					method: "get",
					params: this.queryInfo
				});
				if (res.meta.status !== 200) {
					return this.$Message.error('获取商品列表失败！')
				}
				console.log(res.data)
				this.goodsList=res.data.goods;
				this.total=res.data.total;
			},
			//start 商品删除操作-->
			async removeByID(id){
				const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
				 	url: `goods/${id}`,
				 	method: 'delete',
				 })
				 if (res.meta.status !== 200) {
				 	return this.$Message.error('删除商品失败')
				 }
				 this.$Message.success('删除商品成功!')
				 this.getCateList()
			},
			//end 商品删除操作-->
			//start 商品添加操作-->
			goAddGoodsPage(){
				this.$router.push('/goods/add')
			},
			//end 商品添加操作-->
			// start 分页响应
			handleSizeChange(newSize){
				this.queryInfo.pagesize=newSize
				this.getCateList()
			},
			handleCurrentChange(newPage){
				this.queryInfo.pagenum=newPage
				this.getCateList()
			},
			//end 分页响应
		},
		created() {
			this.getCateList()
		}
	}
</script>

<style lang="less" scoped>
</style>
