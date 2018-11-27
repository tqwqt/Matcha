import db from '../dbPromiseConnect'

const updateProfileTags = (id, tags) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                let sql = 'INSERT INTO tags (user_id, tag) VALUES ';
                let params = [];

                tags.forEach((tag, index) => {
                    sql += "(?, '" + tag.text + "')" + (index + 1 !== tags.length ? ", " : "");
                    params.push(id);
                });
                return connection.query(sql, params);
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export {updateProfileTags}