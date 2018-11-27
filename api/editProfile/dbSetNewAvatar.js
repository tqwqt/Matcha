import db from '../dbPromiseConnect';

const setNewAvatar = (id, source) => {

    return new Promise((resolve, reject) => {

        db.get()
            .then(connection => {

                let sql = 'UPDATE photo SET is_avatar = 1 WHERE user_id = ? AND url = ?';
                return connection.query(sql, [id, source.source]);

            }).then((result) => {
                resolve(result);
        }).catch((error) => {
            reject(error);
        });

    });
};


export {setNewAvatar}