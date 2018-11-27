import db from '../dbPromiseConnect'

const reportUser = (who_id, whom_id) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'INSERT INTO reports (who_id, whom_id) VALUES(?,?)';
                return connection.query(sql, [who_id, whom_id]);
            })
            .then(result => {
                resolve();
            }).catch(err => {
                reject(err);
        });
    });

};
export {reportUser}