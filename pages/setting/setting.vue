<template>
	<view class="content">
		<view class="uni-form-item uni-column">
			<view class="title">
				定位启动
				<switch name="switch" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Setting'
			}
		},
		onLoad() {
	
		},
		methods: {
	
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>