<template>
	<view class="content">
		<map :scale='18' @tap="getRemoteInfo()" style="width: 100%;" :style="{height: mapHeight + 'px'}"
		:longitude="longitude" :latitude="latitude">
		</map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 在data中初始化的中心位置
				latitude: 39.909,
				longitude: 116.39742
			}
		},
		onLoad() {
			const _this = this;
			uni.getSystemInfo({
				success: (res) => {
					_this.mapHeight = res.screenHeight - res.statusBarHeight
					_this.mapHeight = _this.mapHeight
				}
			});
		},
		methods: {
			// 获取云数据库数据
			getRemoteInfo() {
				// 调用云函数向云数据库插入数据
				uniCloud.callFunction({
					name: "readPositionData",
					data: {
						deviceID: '80703833cbfcc1f9'
					}
				}).then((res) => {
					var data = res.result.data;
					console.log(data);
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
				});
			}
		}
	}
</script>

<style>
	
    .content {
        flex: 1;
    }
	
</style>