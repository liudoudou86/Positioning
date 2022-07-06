<template>
	<view>
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th width="100" align="center">昵称</uni-th>
					<uni-th width="100" align="center">手机号</uni-th>
					<uni-th width="90" align="center">设置</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td align="center">
						<view class="name">{{ item.userName }}</view>
					</uni-td>
					<uni-td align="center">
						<view class="mobile">{{ item.mobile }}</view>
					</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="warn" @click="deleteUserList()">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				loading: false
			}
		},
		onLoad() {
			this.getUserList()
		},
		methods: {
			getUserList() {
				this.loading = true;
				// 获取本机设备ID
				const that = this
				uni.getSystemInfo({
					success: function(res) {
						that.deviceId = res.deviceId
					},
					fail: function(err) {
						console.log(err)
					}
				});
				console.log("本机设备ID：" + this.deviceId);
				// 调用云函数查询设备ID
				uniCloud.callFunction({
					name: "readUserData",
					data: {
						deviceID: this.deviceId,
					}
				}).then((res) => {
					console.log(res);
					this.tableData = res.result.data;
					this.loading = false;
				}).catch((err) => {
					console.log(err);
				});
			},
			deleteUserList() {
				// 获取本机设备ID
				const that = this
				uni.getSystemInfo({
					success: function(res) {
						that.deviceId = res.deviceId
					},
					fail: function(err) {
						console.log(err)
					}
				});
				console.log("本机设备ID：" + this.deviceId);
				// 调用云函数删除设备ID
				uniCloud.callFunction({
					name: "clearUserData",
					data: {
						deviceID: this.deviceId,
					}
				}).then((res) => {
					console.log(res);
				}).catch((err) => {
					console.log(err);
				});
			}
		}
	}
</script>

<style>

	.uni-group {
		display: flex;
		align-items: center;
	}

</style>