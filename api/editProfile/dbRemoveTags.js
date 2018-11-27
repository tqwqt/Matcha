import db from '../dbPromiseConnect'

const removeProfileTags = (id) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'DELETE FROM tags WHERE user_id = ?';
                return connection.query(sql, [id]);
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export {removeProfileTags}