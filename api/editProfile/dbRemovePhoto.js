import db from '../dbPromiseConnect'
import * as fs from 'fs';

const removePhoto = (id, source) => {

    let splitres = source.source.split('/');
    let src = "./public/userInfo/photos/" + splitres[splitres.length - 1];

    fs.unlink(src, (err) => {
        if (err) throw err;
    });

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'DELETE FROM photo WHERE user_id = ? AND url = ?';
                return connection.query(sql, [id, source.source]);
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export {removePhoto}