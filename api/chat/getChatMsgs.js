import db from '../dbPromiseConnect'

const getChatMsgs = (id) => {


	return new Promise((resolve, reject) => {
		db.get().then((connection) => {
			const sql = 'SELECT * FROM message WHERE chat_id = ?';
			return connection.query(sql, [id]);
		}).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
};

export {getChatMsgs}