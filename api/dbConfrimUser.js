import db from './dbPromiseConnect';

const confirmUser = (login, token) => {

    return new Promise((resolve, reject) => {
       db.get().then((connection) => {

           const sql = `UPDATE users SET token = 'verified' WHERE login = ? AND token = ?`;
           return connection.query(sql, [login, token]);
       }).then((result) => {
           resolve(result);
       }).catch((error) => {
           reject(error);
       });
    });

};

export {confirmUser}