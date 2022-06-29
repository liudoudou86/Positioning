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
	export default {
		data() {
			return {
				// 在data中初始化的中心位置
				latitude: 39.54,
				longitude: 116.23,
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
							radius: 50, //半径
							strokeWidth: 3 //描边的宽度
						}]
					},
					fail: function(err) {
						console.log(err)
					}
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