'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('clearpositiondata: ', event)
	// 初始化数据库
	const db = uniCloud.database();
	// 读取user表数据,此处orderBy写法为正确写法
	const res = await db.collection('info').where(event).remove();
	console.log("删除info表数据", res)
	//返回数据给客户端
	return res
};