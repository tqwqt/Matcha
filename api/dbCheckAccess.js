import db from './dbPromiseConnect';

const checkAccess = (id) => {

    return new Promise((resolve, reject) => {

        db.get().then((connection) => {

            const sql = 'SELECT has_access FROM users WHERE id = ?';
            return connection.query(sql, [id]);

        }).then(result => {
            resolve(result);
        }).catch(error => {
            reject(error)
        });
    });
};

export {checkAccess}