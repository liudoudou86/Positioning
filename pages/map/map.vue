<template>
	<view class="form">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-db">后台定位
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
				var switchcontrol = e.detail.value
				if (switchcontrol == true) { // 创建定时器
					timer = setInterval(get.getPosition, 50000);
					console.log("启动循环,循环ID: " + timer);
					return timer // 传出结果
				} else {
					console.log("结束循环,循环ID: " + timer);
					clearInterval(timer);
				}
			},
			// 读取输入的手机号
			inputmobile: function(e) {
				this.mobile = e.detail.value
			},
			// 获取云数据库数据
			getRemoteInfo() {
				if (this.name == null || this.name == "" || this.mobile == null || this.mobile == "") {
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
							mobile: this.mobile,
						}
					}).then((res) => {
						var data = res.result.data;
						this.deviceID = data[0].deviceID;
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
	}
</script>

<style>
	
	.form{
		padding: 0 100upx;
		margin-top: 80px;
	}
	
	.uni-list-cell-db {
		margin-top: 10px;
		margin-left: 15px;
	}
	
	.uni-padding-wrap {
	    margin-top: 30rpx;
	    margin-bottom: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.inputWrapper{
		width: 230px;
		height: 50px;
		background: #C0C0C0;
		border-radius: 20px;
		padding: 0 20px;
	    margin-top: 30rpx;
	    margin-bottom: 10rpx;
		margin-left: 30rpx;
		margin-right: 50rpx;
	}
	
	.inputWrapper .input{
		width: 200px;
		height: 50px;
		text-align: center;
		font-size: 15px;
	}

</style>