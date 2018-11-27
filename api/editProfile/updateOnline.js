import db from '../dbPromiseConnect'

const updateOnline = (is_online, user_id) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'UPDATE users SET is_online = ?, last_seen = NOW() ' +
                    'WHERE id = ?';
                return connection.query(sql, [is_online, user_id]);
            })
            .then((seenMsgs) => {
                resolve(seenMsgs.affectedRows);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export {updateOnline}