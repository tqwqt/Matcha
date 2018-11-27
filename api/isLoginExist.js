import db from './dbPromiseConnect';


const isLoginExist = (login) => {

    return new Promise((resolve, reject) => {

        db.get().then((connection) => {

            const sql = 'SELECT id FROM users WHERE login = ?';

            return connection.query(sql, [login]);

        }).then(result => {
            if (result.length !== 0) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        }).catch(error => {
            reject(error);
        });
    });

};

export {isLoginExist}