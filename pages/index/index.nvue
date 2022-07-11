<template>
	<view class="content">
		<map :scale='18' @updated="getLocationInfo()" style="width: 100%;" :style="{height: mapHeight + 'px'}"
		:longitude="longitude" :latitude="latitude" :markers="markers" :circles="circles">
		</map>
	</view>
	<view class="uni-padding-wrap uni-common-mt">
	    <button type="primary" @click="getLocationInfo()">刷新位置</button>
	</view>
</template>

<script>
	import time from '@/common/time.js'; // 引用位置函数
	
	export default {
		data() {
			return {
				// 在data中初始化的中心位置
				latitude: '',
				longitude: '',
				markers: [],
				circles: []
			}
		},
		onLoad() {
			const _this = this;
			uni.getSystemInfo({
				success: (res) => {
					_this.mapHeight = res.screenHeight - res.statusBarHeight -150
					_this.mapHeight = _this.mapHeight
				}
			});
		},
		methods: {
			// 获取地理位置
			getLocationInfo() {
				// 封装获取定位函数
				const that = this
				// 获取本机设备ID
				uni.getSystemInfo({
					success: function(res) {
						that.deviceId = res.deviceId
					},
					fail: function(err) {
						console.log(err)
					}
				});
				console.log("本机设备ID：" + this.deviceId);
				// 调用云函数查询设备ID
				uniCloud.callFunction({
					name: "readUserData",
					data: {
						deviceID: this.deviceId,
					}
				}).then((res) => {
					var thisdeviceID = this.deviceId;
					var data = res.result.data;
					var readDeviceID = data[0].deviceID;
					console.log("读取设备ID：" + readDeviceID);
					if (thisdeviceID === readDeviceID) {
						uni.getLocation({
							type: 'gcj02', // gcj02为高德定位
							isHighAccuracy: true, // 高精度定位
							success: function(res) {
								that.latitude = res.latitude
								that.longitude = res.longitude
								console.log("当前纬度：" + that.latitude);
								console.log("当前经度：" + that.longitude);
								if (that.latitude != null && that.longitude != null) {
									// 调用云函数向云数据库插入数据
									uniCloud.callFunction({
										name: "insertPositionData",
										data: {
											deviceID: thisdeviceID,
											latitude: that.latitude,
											longitude: that.longitude,
											createTime: time.now()
										}
									}).then((res) => {
										// console.log(res)
									}).catch((err) =>{
										console.log(err)
									});
									//标记点
									that.markers = [{
										id: 0,
										latitude: res.latitude,
										longitude: res.longitude,
										iconPath: '/static/location.png'
									}],
									that.circles = [{
										latitude: res.latitude,
										longitude: res.longitude,
										color: "#C0C0C0", //描边的颜色
										radius: 30, //半径
										strokeWidth: 5 //描边的宽度
									}]
								}
							},
							fail: function(err) {
								console.log(err)
							}
						});
					}
				}).catch((err) =>{
					uni.hideLoading()
					uni.showModal({
						content: "请先注册",
						showCancel: false
					})
					// console.log(err)
				});
			}
		}
	}
</script>

<style>
	
    .content {
        flex: 1;
    }
	
	.uni-padding-wrap {
	    margin-top: 30rpx;
	    margin-bottom: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}
	
</style>