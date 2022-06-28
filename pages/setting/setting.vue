<template>
	<view class="content">
		<view class="uni-form-item uni-column">
			<view class="title">定位启动
				<switch @change="switchChange" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {},
		methods: {
			switchChange: function (e) {
				console.log(e.detail.value)
				var switchcontrol = e.detail.value
				if (switchcontrol == true) {
					console.log("success")
					uni.getLocation({
						type: 'gcj02', // gcj02为高德定位
						isHighAccuracy: true, // 高精度定位
						success: function(res) {
							var latitude = res.latitude
							var longitude = res.longitude
							console.log("当前纬度：" + latitude)
							console.log("当前经度：" + longitude)
						},
						fail: function(err) {
							console.log(err)
						},
					});
				}
			}
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