import db from '../dbPromiseConnect'

const updateSeenMsg = (chat_id, user_id) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'UPDATE message SET is_seen = 1 ' +
                            'WHERE sender_id = ? AND chat_id = ? AND is_seen = 0';
                return connection.query(sql, [user_id, chat_id]);
            })
            .then((seenMsgs) => {
                resolve(seenMsgs.affectedRows);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export {updateSeenMsg}