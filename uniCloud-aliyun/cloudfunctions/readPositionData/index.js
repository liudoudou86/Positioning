'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('readpositiondata: ', event)
	// 初始化数据库
	const db = uniCloud.database();
	// 读取info表数据,此处orderBy写法为正确写法
	const res = await db.collection('info').where(event).orderBy('createTime','desc').limit(1).get();
	console.log("读取info表数据", res)
	//返回数据给客户端
	return res
}