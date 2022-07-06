'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('clearuserdata: ', event)
	// 初始化数据库
	const db = uniCloud.database();
	const res = await db.collection('user').where(event).remove();
	console.log("删除user表数据", res)
	//返回数据给客户端
	return res
};
