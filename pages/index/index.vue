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
	import get from '@/common/getPosition.js'; // 引用位置函数
	
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
					_this.mapHeight = res.screenHeight - res.statusBarHeight -150
					_this.mapHeight = _this.mapHeight
				}
			});
		},
		methods: {
			// 获取地理位置
			getLocationInfo() {
				get.getPosition()
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