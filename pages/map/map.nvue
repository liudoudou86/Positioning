<template>
	<view class="content">
		<map :scale='18' id="myMap"  style="width: 100%;" :style="{height: mapHeight + 'px'}" 
		:markers="markers"  :longitude="longitude" :latitude="latitude" :circles="circles"></map>
	</view>
</template>

<script>
	export default {
		onLoad() {
			const _this = this;
			uni.getSystemInfo({
				success: (res) => {
					_this.mapHeight = res.screenHeight - res.statusBarHeight
					_this.mapHeight = _this.mapHeight
				}
			})
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