import db from '../dbPromiseConnect';

const createChat = (user1, user2) => {
    return new Promise((resolve, reject) => {
        db.get().then((connection) => {

            const sql = 'INSERT INTO chat (user1_id,user2_id) VALUES (?, ?)';
            return connection.query(sql, [user1, user2]);

        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
};

export {createChat}