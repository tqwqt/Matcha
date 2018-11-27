import db from '../dbPromiseConnect'

const setField = (where_field, where_value, field, value) => {

    return new Promise((resolve, reject) => {
        db.get().then((connection) => {

            const sql = 'UPDATE users SET ' + field + ' = ? WHERE ' + where_field + ' = ?';

            connection.query(sql, [value, where_value]);
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });

    });
};

export {setField}