import db from '../dbPromiseConnect'

const getChatAvatars = (ids, callback) => {
    if (ids.length === 0)
        ids = [0];

    return new Promise((resolve, reject) => {
       db.get().then((connection) => {
          const sql = 'SELECT * FROM photo WHERE is_avatar = 1 AND user_id IN ?';
          return connection.query(sql, [[ids]]);
       }).then((result) => {
           resolve(result);
       }).catch((error) => {
           reject(error);
       });
    });
};

export {getChatAvatars}
