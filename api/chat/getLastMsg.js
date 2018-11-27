import db from '../dbPromiseConnect'


const getLastMsg = (id) => {


    return new Promise((resolve, reject) => {
        db.get().then((connection) => {
           const sql = 'SELECT * FROM `message` ' +
               'INNER JOIN chat ' +
               'on message.chat_id = chat.id ' +
               'WHERE message.id IN ' +
               '(SELECT MAX(id) FROM message ' +
               'GROUP BY chat_id) ' +
               'AND (chat.user1_id = ? OR chat.user2_id = ?)';
           return connection.query(sql, [id, id]);
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
};

export {getLastMsg}
