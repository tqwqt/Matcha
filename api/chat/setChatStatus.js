import db from '../dbPromiseConnect';

const setChatStatus = (value, user1, user2) => {

    return new Promise((resolve, reject) => {
       db.get().then((connection) => {

           let valuePart = '';

           if (value !== -1) {
               valuePart = value;
           }
           else {
               valuePart = '!is_active';
           }

          const sql =  'UPDATE chat SET is_active = ' + valuePart + ' WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)';
          return connection.query(sql, [user1, user2, user2, user1]);

       }).then((result) => {
           resolve(result);
       }).catch((error) => {
           reject(error);
       });
    });
};

export {setChatStatus}