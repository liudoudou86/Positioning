<template>
	<view class="content">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-db">后台定位</view>
				<switch type="switch" @change="switchChange"/>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
		    <button type="primary" @click="getRemoteInfo()">查看位置</button>
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
					}).catch((err) => {
						console.log(err)
					})
				}
			},
			// 获取云数据库数据
			getRemoteInfo() {
				// 调用云函数向云数据库读取数据
				uniCloud.callFunction({
					name: "readPositionData",
					data: {
						deviceID: '67e983c1e2139685'
					}
				}).then((res) => {
					var data = res.result.data;
					console.log(res);
					const latitude = data[0].latitude;
					const longitude = data[0].longitude;
					console.log("当前纬度：" + latitude);
					console.log("当前经度：" + longitude);
					uni.openLocation({
						latitude: latitude,
						longitude: longitude,
						success: function(res) {
							console.log(res)
						},
						fail: function(err) {
							console.log(err)
						}
					});
				}).catch((err) => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	
	.content {
		flex: 1;
	}
	
	.uni-list-cell {
		padding: 0 30rpx;
	}
	
	.uni-padding-wrap {
	    margin-top: 30rpx;
	    margin-bottom: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}
	
</style>