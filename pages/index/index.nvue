<template>
	<view class="content">
		<map :scale='18' @updated='getLocationInfo()' style="width: 100%;" :style="{height: mapHeight + 'px'}" 
		:longitude="longitude" :latitude="latitude" :markers="markers" :circles="circles">
		</map>
	</view>
</template>

<script>
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
					_this.mapHeight = res.screenHeight - res.statusBarHeight
					_this.mapHeight = _this.mapHeight
				}
			});
		},
		methods: {
			// 获取地理位置
			getLocationInfo() {
				const that = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						that.latitude = res.latitude
						that.longitude = res.longitude
						console.log(res.latitude)
						console.log(res.longitude)
						//标记点
						that.markers = [{
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../../static/img/pos.png',
						}]
						that.circles = [{ //在地图上显示圆
							latitude: res.latitude,
							longitude: res.longitude,
							fillColor: "#D9E6EF", //填充颜色
							color: "#A7B6CB", //描边的颜色
							radius: 50, //半径
							strokeWidth: 2 //描边的宽度
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

    .map {
        width: 750rpx;
        height: 250px;
        background-color: #f0f0f0;
    }
</style>