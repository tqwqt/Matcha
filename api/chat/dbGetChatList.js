import db from '../dbPromiseConnect'

const getChatList = (id) => {

	return new Promise((resolve, reject) => {
		db.get().then((connection) => {
			const sql = 'SELECT users.id as user_id,  users.login, users.name, users.lastName, users.is_online, users.last_seen, chat.id FROM users ' +
						'LEFT JOIN chat ' +
						'ON chat.user1_id = users.id OR chat.user2_id = users.id ' +
						'WHERE chat.is_active = 1 AND users.id != ? AND (chat.user1_id = ? OR chat.user2_id = ?)';
			return connection.query(sql, [id, id, id]);
	}).then((result) => {
		resolve(result);
	}).catch((error) => {
        reject(error);
        });
	});
};

export {getChatList}




