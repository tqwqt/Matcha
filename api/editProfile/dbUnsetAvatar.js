import db from '../dbPromiseConnect';

const unsetAvatar = (id) => {

    return new Promise((resolve, reject) => {

        db.get()
            .then(connection => {

                let sql = 'UPDATE photo SET is_avatar = 0 WHERE user_id = ?';
                return connection.query(sql, [id]);

            }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });

    });
};


export {unsetAvatar}