'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 初始化数据库
	const db = uniCloud.database();
	// 向info表插入数据
	const res = await db.collection('info').get(event);
	console.log(res)
	//返回数据给客户端
	return res
};