<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<div id="main" style="width: 800px;height:400px;"></div>
		</el-card>
	</div>
</template>

<script>
	//1.导入
	import echarts from 'echarts'
	import _ from 'lodash'
	export default {
		data() {
			return {
				options: {
					title: {
						text: 'ECharts 入门示例'
					},
					tooltip: {},
					legend: {
						data: ['销量']
					},
					xAxis: {
						data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
					},
					yAxis: {},
					series: [{
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					}]
				},
			}
		},
		created() {
			this.getReport()
		},
		//2.dom被加载完成
		async mounted() {
			//3.初始化
			var myChart = echarts.init(document.getElementById('main'));
			//4.配置和数据
			const {
				data: res
			} = await this.$axios.request({
				url: "/reports/type/1",
				method: "get",
				params: {}
			});
			if (res.meta.status !== 200) {
				return this.$Message.error('获取折线图数据失败！')
			}
			
			const result=_.merge(res.data, this.options)
			//设置配置和数据
			myChart.setOption(result);
		},
		methods: {
			//获取报告
			async getReport() {

				
			}
		}
	}
</script>

<style lang="less" scoped>
</style>
