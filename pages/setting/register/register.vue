<template>
	<view class="form">
		<view class="inputWrapper">
			<input class="input" type="text" @input="inputname" value="" placeholder="请输入昵称"/>
		</view>
		<view class="inputWrapper">
			<input class="input" type="number" @input="inputmobile" maxlength="11" value="" placeholder="请输入手机号"/>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
		    <button type="primary" @click="getUserInfo()" >注册</button>
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
				if (this.name === null || this.name === "") {
					uni.hideLoading();
					uni.showModal({
						content: "昵称不能为空",
						showCancel: false
					});
				} else {
					if (this.mobile === null || this.mobile === "") {
						uni.hideLoading();
						uni.showModal({
							content: "手机号不能为空",
							showCancel: false
						});
					} else {
						var mobileNumber = this.mobile.toString().length;
						console.log("手机号长度: " + mobileNumber);
						if (mobileNumber < 11) {
							uni.hideLoading();
							uni.showModal({
								content: "手机号长度不足11",
								showCancel: false
							});
						} else {
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
								// console.log(res)
							}).catch((err) =>{
								uni.hideLoading()
								uni.showModal({
									content: "注册失败",
									showCancel: false
								})
								// console.log(err)
							});
						}
					}
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
	
	.inputWrapper{
		width: 170px;
		height: 50px;
		background: #C0C0C0;
		border-radius: 20px;
		padding: 0 20px;
	    margin-top: 50rpx;
	    margin-bottom: 50rpx;
		margin-left: 50rpx;
		margin-right: 50rpx;
	}
	
	.inputWrapper .input{
		width: 170px;
		height: 50px;
		text-align: center;
		font-size: 15px;
	}
	
	.uni-padding-wrap {
	    margin-top: 50rpx;
	    margin-bottom: 50rpx;
		margin-left: 50rpx;
		margin-right: 50rpx;
	}

</style>