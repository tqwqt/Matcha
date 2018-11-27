import db from '../dbPromiseConnect'
import bcrypt from 'bcrypt'

const setPassword = (id, password, restore = -1) => {

    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10).then((hash) => {
            const restore_part = restore === -1 ? '' : ', users.restore_token = NULL ';
            db.get().then((connection) => {

                const sql = 'UPDATE users SET users.password = ? ' + restore_part + ' WHERE id = ?';
                connection.query(sql, [hash, id]);
            }).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(result);
            });
        });
    });
};

export {setPassword}