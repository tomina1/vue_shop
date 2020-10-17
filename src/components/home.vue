<template>
	<div class="home_container">

		<el-button type="info" @click="outline">login</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			outline() {
				sessionStorage.removeItem('token')
				this.$router.push('/login')
			}
		}
	}
</script>

<style lang="less" scoped>
</style>
