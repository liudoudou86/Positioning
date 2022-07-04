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
// 封装获取定位函数
const getPosition = function() {
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
		var data = res.result.data;
		var readDeviceID = data[0].deviceID;
		console.log("读取设备ID：" + readDeviceID);
		if (this.deviceId == readDeviceID) {
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
						color: "#C0C0C0", //描边的颜色
						radius: 30, //半径
						strokeWidth: 5 //描边的宽度
					}]
				},
				fail: function(err) {
					console.log(err)
				}
			});
			console.log("当前纬度：" + this.latitude);
			console.log("当前经度：" + this.longitude);
			// 调用云函数向云数据库插入数据
			uniCloud.callFunction({
				name: "insertPositionData",
				data: {
					deviceID: this.deviceId,
					latitude: this.latitude,
					longitude: this.longitude,
					createTime: now()
				}
			}).then((res) => {
				console.log(res)
			}).catch((err) =>{
				console.log(err)
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
	getPosition
}