import db from '../dbPromiseConnect'

const selectNotifications = (whom_id) => {
    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'SELECT notification.who_id, notification.whom_id, notification.type, notification.is_seen, notification.time, users.login ' +
                    'FROM notification ' +
                    'INNER JOIN users ON users.id = notification.who_id ' +
                    'WHERE whom_id = ? ' +
                    'ORDER BY time DESC';

                return  connection.query(sql, [whom_id]);
            })
            .then((result) => {

                resolve(result);
            })
            .catch( reason => {
            });
    });

};

export {selectNotifications}