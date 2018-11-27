import db from '../dbPromiseConnect';

const setBool = (who_id, whom_id, field) => {
    return new Promise((resolve, reject) => {
       db.get().then((connection) => {
           const sql = 'UPDATE user_visits SET ' + field + '= !' + field + ' WHERE who_id = ? AND whom_id = ?';
           return connection.query(sql, [who_id, whom_id]);
       }).then((result) => {
           resolve(result);
       }).catch((error) => {
           reject(error);
       });
    });
};

export {setBool}