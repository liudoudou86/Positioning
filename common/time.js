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
// 导出函数，getPosition是vue调用函数的接口
export default{
	now
}