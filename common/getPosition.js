// 封装时间函数
const now = function() {
	var date = new Date();
	var year = date.getFullYear(); //获取完整的年份(4位)
	var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
	var day = date.getDate(); //获取当前日(1-31)
	var hour = date.getHours(); //获取当前小时数(0-23)
	var minute = date.getMinutes(); //获取当前分钟数(0-59)
	var second = date.getSeconds(); //获取当前秒数(0-59)
	var timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
	return timer;
}
// 封装位置函数
const position = function() {
	const that = this
	// 获取本机设备ID
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
		var thisdeviceID = this.deviceId;
		var data = res.result.data;
		var readDeviceID = data[0].deviceID;
		console.log("读取设备ID：" + readDeviceID);
		if (thisdeviceID == readDeviceID) {
			uni.getLocation({
				type: 'gcj02', // gcj02为高德定位
				isHighAccuracy: true, // 高精度定位
				success: function(res) {
					that.latitude = res.latitude
					that.longitude = res.longitude
					console.log("当前纬度：" + that.latitude);
					console.log("当前经度：" + that.longitude);
					if (that.latitude != null && that.longitude != null) {
						// 调用云函数向云数据库插入数据
						uniCloud.callFunction({
							name: "insertPositionData",
							data: {
								deviceID: thisdeviceID,
								latitude: that.latitude,
								longitude: that.longitude,
								createTime: now()
							}
						}).then((res) => {
							console.log(res)
						}).catch((err) =>{
							console.log(err)
						});
					}
				},
				fail: function(err) {
					console.log(err)
				}
			});
		}
	}).catch((err) =>{
		uni.hideLoading()
		uni.showModal({
			content: "请先注册",
			showCancel: false
		})
		console.log(err)
	});
}
// 导出函数，getPosition是vue调用函数的接口
export default{
	position
}