import db from '../dbPromiseConnect'

const insertNotification = (who_id, whom_id, type) => {
    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'REPLACE INTO notification (who_id, whom_id, type, is_seen, time) VALUES (?, ?,?, 0, NOW(3))';

                return  connection.query(sql, [who_id, whom_id, type]);
            })
            .then((result) => {

                resolve(result);
            })
            .catch( reason => {
            });
    });

};

export {insertNotification}