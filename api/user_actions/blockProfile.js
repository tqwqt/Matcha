import db from '../dbPromiseConnect'

const blockUser = (who_id, whom_id) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'INSERT INTO black_list (who_id, whom_id) VALUES(?,?)';
                return connection.query(sql, [who_id, whom_id]);
            })
            .then(result => {
                resolve();
            })
            .catch(reject);
    });

};
export {blockUser}