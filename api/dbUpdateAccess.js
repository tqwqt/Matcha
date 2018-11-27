import db from './dbPromiseConnect';

const updateAccess = (id) => {

   return new Promise((resolve, reject) => {

       db.get().then((connection) => {

           const sql = 'UPDATE users SET users.has_access = 1 WHERE users.id = ?';
           return connection.query(sql, [id]);

       }).then((result) => {
           resolve(result);
       }).catch((error) => {
           reject(error);
       });
   });
};

export {updateAccess}