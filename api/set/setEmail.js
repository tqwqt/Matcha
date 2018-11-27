import db from '../dbPromiseConnect';

const setEmail = (id, email) => {

    return new Promise((resolve, reject) => {

        db.get().then((connection) => {

            const sql = 'UPDATE users SET email = ? WHERE id = ?';

            return connection.query(sql, [email, id]);
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });

};

export {setEmail}