<template>
	<view class="form">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-db">后台定位</view>
				<switch type="switch" @change="switchChange"/>
			</view>
			<view class="inputWrapper">
				<input class="input" type="number" @input="inputmobile" maxlength="11" value="" placeholder="请输入手机号"/>
			</view>
			<view class="uni-padding-wrap uni-common-mt">
				<button type="primary" @click="getRemoteInfo()">查看位置</button>
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
						var data = res.result.data;
						var readDeviceID = data[0].deviceID;
						console.log("读取设备ID：" + readDeviceID);
						if (this.deviceId == readDeviceID) {
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
							console.log("当前纬度：" + this.latitude);
							console.log("当前经度：" + this.longitude);
							// 调用云函数向云数据库插入数据
							uniCloud.callFunction({
								name: "insertPositionData",
								data: {
									deviceID: this.deviceId,
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
					}).catch((err) =>{
						uni.hideLoading()
						uni.showModal({
							content: "请先注册",
							showCancel: false
						})
						console.log(err)
					});
				}
			},
			// 读取输入的手机号
			inputmobile: function(e) {
				this.mobile = e.detail.value
			},
			// 获取云数据库数据
			getRemoteInfo() {
				// 调用云函数查询设备ID
				uniCloud.callFunction({
					name: "readUserData",
					data: {
						mobile: this.mobile,
					}
				}).then((res) => {
					var data = res.result.data;
					this.deviceID = data[0].deviceID;
					console.log("读取设备ID：" + this.deviceID);
					// 调用云函数向云数据库读取数据
					uniCloud.callFunction({
						name: "readPositionData",
						data: {
							deviceID: this.deviceID
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
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: "无此手机号",
						showCancel: false
					})
					console.log(err);
				});	
			}
		}
	}
</script>

<style>

	.form{
		padding: 0 100upx;
		margin-top: 80px;
	}
	
	.inputWrapper{
		width: 200px;
		height: 50px;
		background: white;
		border-radius: 20px;
		padding: 0 20px;
		margin-top: 10px;
	}
	
	.inputWrapper .input{
		width: 150px;
		height: 50px;
		text-align: center;
		font-size: 15px;
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