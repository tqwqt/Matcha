import db from '../dbPromiseConnect';

const isConnected = (who_id, whom_id) => {

        return new Promise((resolve, reject) => {
           db.get().then((connection) => {

               const sql = 'SELECT * FROM user_visits WHERE ((who_id = ? AND whom_id =?) OR (who_id = ? AND whom_id = ?)) AND is_like = true';

               return connection.query(sql, [who_id, whom_id, whom_id, who_id]);

           }).then((result) => {
               if (result.length === 2) {
                   resolve(true);
               }
               else {
                   resolve(false);
               }
           }).catch((error) => {
               reject(error);
           });
        });
};

export {isConnected}