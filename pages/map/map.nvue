<template>
	<view class="content">
		<map :scale='18' style="width: 100%;" :style="{height: mapHeight + 'px'}" 
		:longitude="longitude" :latitude="latitude" :markers="markers" :circles="circles">
		</map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 在data中初始化的中心位置
				latitude: 39.9,
				longitude: 116.4,
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