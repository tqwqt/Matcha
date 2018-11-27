import db from '../dbPromiseConnect'

const updateSeenNotifications = (whom_id) => {
    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'UPDATE notification SET is_seen = 1 ' +
                            'WHERE whom_id = ?';
                return  connection.query(sql, [whom_id]);
            })
            .then((result) => {

                resolve(result);
            })
            .catch( reason => {
            });
    });

};

export {updateSeenNotifications}