import db from '../dbPromiseConnect';


const isFieldExist = (field, value) => {

    return new Promise((resolve, reject) => {

        db.get().then((connection) => {

            const sql = 'SELECT * FROM users WHERE ' + field + ' = ?';

            return connection.query(sql, [value]);
        }).then((result) => {
            if (result.length !== 0) {
                let obj = {bool: true, result: result};
                resolve(obj);
            }else {
                resolve(result);
            }
        }).catch((error) => {
            reject(error);
        });
    });
};

export {isFieldExist}