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
	import time from '@/common/time.js'; // 引用自定义函数
	
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
				const that = this
				uni.getLocation({
					type: 'gcj02', // gcj02为高德定位
					isHighAccuracy: true, // 高精度定位
					success: function(res) {
						that.latitude = res.latitude
						that.longitude = res.longitude
						console.log(res)
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
							color: "#A7B6CB", //描边的颜色
							radius: 30, //半径
							strokeWidth: 5 //描边的宽度
						}]
					},
					fail: function(err) {
						console.log(err)
					}
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