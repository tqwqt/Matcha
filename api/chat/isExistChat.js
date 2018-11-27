import db from '../dbPromiseConnect';

const isExistChat = (user1_id, user2_id) => {

    return new Promise((resolve, reject) => {
        db.get().then((connection) => {
           const sql = 'SELECT * FROM chat WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)';

           return connection.query(sql, [user1_id, user2_id, user2_id, user1_id]);
        }).then((result) => {
           resolve(result);
        }).catch((error) => {
            reject(error);
        });
    })
};

export {isExistChat}