<template>
	<view class="content">
		<uni-list class="scrollview">
			<uni-list-item :show-switch="true" title="持续定位" @switchChange="switchChange" />
		</uni-list>
	</view>
	<view class="form">
		<view class="inputWrapper">
			<input class="input" type="text" @input="inputname" value="" placeholder="请输入昵称"/>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<button type="primary" @click="getRemoteInfo()">查看位置</button>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<button type="primary" @click="clearPosition()">清空数据库</button>
		</view>
	</view>
</template>

<script>
	import get from '@/common/getPosition.js'; // 引用位置函数
	
	export default {
		data() {
			return {}
		},
		onLoad() {},
		methods: {
			switchChange: function (e) {
				var switchcontrol = e.value
				if (switchcontrol === true) { // 创建定时器
					timer = setInterval(get.position, 10000);
					console.log("启动循环,循环ID: " + timer);
					return timer // 传出结果
				} else {
					console.log("结束循环,循环ID: " + timer);
					clearInterval(timer);
				}
			},
			// 读取输入的昵称
			inputname: function(e) {
				this.name = e.detail.value
			},
			// 获取云数据库位置信息
			getRemoteInfo() {
				if (this.name === null || this.name === "") {
					uni.hideLoading()
					uni.showModal({
						content: "不能为空",
						showCancel: false
					})
				} else {
					// 调用云函数查询设备ID
					uniCloud.callFunction({
						name: "readUserData",
						data: {
							userName: this.name,
						}
					}).then((res) => {
						var deviceData = res.result.data;
						this.deviceID = deviceData[0].deviceID;
						// 调用云函数向云数据库读取数据
						uniCloud.callFunction({
							name: "readPositionData",
							data: {
								deviceID: this.deviceID
							}
						}).then((res) => {
							var positionData = res.result.data;
							// console.log(res);
							const latitude = positionData[0].latitude;
							const longitude = positionData[0].longitude;
							console.log("当前纬度：" + latitude);
							console.log("当前经度：" + longitude);
							uni.openLocation({
								latitude: latitude,
								longitude: longitude,
								success: function(res) {
									// console.log(res)
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
							content: "无此用户",
							showCancel: false
						})
						// console.log(err);
					});	
				}
			},
			// 清空云数据库位置信息
			clearPosition() {
				if (this.name === null || this.name === "") {
					uni.hideLoading()
					uni.showModal({
						content: "不能为空",
						showCancel: false
					})
				} else {
					// 调用云函数查询设备ID
					uniCloud.callFunction({
						name: "readUserData",
						data: {
							userName: this.name,
						}
					}).then((res) => {
						var deviceData = res.result.data;
						this.deviceID = deviceData[0].deviceID;
						// 调用云函数向云数据库读取数据
						uniCloud.callFunction({
							name: "clearPositionData",
							data: {
								deviceID: this.deviceID
							}
						}).then((res) => {
							// console.log(res)
							if (res.result.deleted === 0) {
								console.log(res.deleted);
								uni.hideLoading()
								uni.showModal({
									content: "无清除数据",
									showCancel: false
								})
							} else {
								uni.hideLoading()
								uni.showModal({
									content: "清除成功",
									showCancel: false
								})
							}
						}).catch((err) => {
							uni.hideLoading()
							uni.showModal({
								content: "清除失败",
								showCancel: false
							})
							// console.log(err)
						});
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: "无此用户",
							showCancel: false
						})
						// console.log(err);
					});	
				}	
			}
		}
	}
</script>

<style>
	
	.content {
	    flex: 1;
	}
	
	.scrollview {
		flex: 1;
	}
	
	.form{
		padding: 0 100upx;
		margin-top: 100px;
		margin-bottom: 100px;
	}

	.inputWrapper{
		width: 230px;
		height: 50px;
		background: #C0C0C0;
		border-radius: 20px;
		padding: 0 20px;
	    margin-top: 30rpx;
	    margin-bottom: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}
	
	.inputWrapper .input{
		width: 200px;
		height: 50px;
		text-align: center;
		font-size: 15px;
	}
	
	.uni-padding-wrap {
	    margin-top: 30rpx;
	    margin-bottom: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

</style>