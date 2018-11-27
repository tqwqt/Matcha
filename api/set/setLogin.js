import db from '../dbPromiseConnect';

const setLogin = (id, login) => {

    return new Promise((resolve, reject) => {

        db.get().then((connection) => {

            const sql = 'UPDATE users SET login = ? WHERE id = ?';

            return connection.query(sql, [login, id]);

        }).then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });
};

export {setLogin}