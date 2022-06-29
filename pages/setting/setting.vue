<template>
	<view class="content">
		<view class="uni-form-item uni-column">
			<view class="title">后台定位
				<switch @change="switchChange" />
			</view>
		</view>
	</view>
</template>

<script>
	import time from '@/common/time.js'; // 引用自定义函数
	
	export default {
		data() {
			return {}
		},
		onLoad() {},
		methods: {
			switchChange: function (e) {
				var switchcontrol = e.detail.value
				if (switchcontrol == true) {
					const that = this // 将this值传出去
					uni.getLocation({
						type: 'gcj02', // gcj02为高德定位
						isHighAccuracy: true, // 高精度定位
						success: function(res) {
							that.latitude = res.latitude
							that.longitude = res.longitude
						},
						fail: function(err) {
							console.log(err)
						},
					});
					uni.getSystemInfo({
						success: function(res) {
							that.deviceId = res.deviceId
							that.deviceModel = res.deviceModel
						},
						fail: function(err) {
							console.log(err)
						}
					});
					console.log("当前纬度：" + this.latitude);
					console.log("当前经度：" + this.longitude);
					console.log("设备ID：" + this.deviceId);
					console.log("设备型号：" + this.deviceModel);
					// 调用云函数向云数据库插入数据
					uniCloud.callFunction({
						name: "insertPositionData",
						data: {
							deviceID: this.deviceId,
							deviceName: this.deviceModel,
							latitude: this.latitude,
							longitude: this.longitude,
							createTime: time.now()
						}
					}).then((res) => {
						console.log(res)
					}).catch((err) =>{
						console.log(err)
					})
				}
			},
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
		padding: 50rpx 0;
	}

</style>