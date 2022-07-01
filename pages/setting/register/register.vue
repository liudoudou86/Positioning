<template>
	<view class="form">
		<view class="inputWrapper">
			<input class="input" type="text" @input="inputname" value="" placeholder="请输入昵称"/>
		</view>
		<view class="inputWrapper">
			<input class="input" type="number" @input="inputmobile" maxlength="11" value="" placeholder="请输入手机号"/>
		</view>
	</view>
	<view class="uni-padding-wrap uni-common-mt">
	    <button type="primary" @click="getUserInfo()" >注册</button>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {}
		},
		onLoad() {},
		methods: {
			inputname: function(e) {
				this.name = e.detail.value
			},
			inputmobile: function(e) {
				this.mobile = e.detail.value
			},
			getUserInfo() {
				const that = this;
				uni.getSystemInfo({
					success: function(res) {
						that.deviceId = res.deviceId
					},
					fail: function(err) {
						console.log(err)
					}
				});
				console.log("用户昵称：" + this.name);
				console.log("手机号：" + this.mobile);
				console.log("设备ID：" + that.deviceId);
				// 调用云函数向云数据库插入数据
				uniCloud.callFunction({
					name: "insertUserData",
					data: {
						userName: this.name,
						mobile: this.mobile,
						deviceID: that.deviceId
					}
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: "注册成功",
						showCancel: false
					})
					console.log(res)
				}).catch((err) =>{
					uni.hideLoading()
					uni.showModal({
						content: "注册失败",
						showCancel: false
					})
					console.log(err)
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
		width: 100%;
		height: 80upx;
		background: white;
		border-radius: 20px;
		box-sizing: border-box;
		padding: 0 20px;
		margin-top: 25px;
	}
	
	.inputWrapper .input{
		width: 100%;
		height: 100%;
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