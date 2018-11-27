import db from '../dbPromiseConnect'

const getTags = (id) => {

    return new Promise((resolve, reject) => {
       db.get().then(connection => {
           const sql = 'SELECT * FROM `tags` WHERE tags.user_id = ?';
           return connection.query(sql, [id]);
       }).then( result => {
           resolve(result);
       }) .catch( reason => reject(reason));
    });
};


export {getTags}