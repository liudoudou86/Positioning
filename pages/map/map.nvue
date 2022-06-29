<template>
	<view class="content">
		<map :scale='18' style="width: 100%;" :style="{height: mapHeight + 'px'}"
		:longitude="longitude" :latitude="latitude" :markers="markers">
		</map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 在data中初始化的中心位置
				latitude: 39.909,
				longitude: 116.39742,
				markers: [{
					id: 0,
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '/static/location.png'
				}]
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
		methods: {}
	}
</script>

<style>
	
    .content {
        flex: 1;
    }
	
</style>