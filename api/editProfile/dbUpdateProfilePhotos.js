import db from '../dbPromiseConnect';

const updateProfilePhotos = (id, formData) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                let url = "../../userInfo/photos/" + formData[0].filename;
                let sql = 'INSERT INTO photo (user_id, url, is_avatar) VALUES (?, ?, ?)';
                let is_avatar = formData[0].fieldname === "avatar" ? 1 : 0;
                let params = [id, url, is_avatar];

                connection.query(sql, params);


                return [url, is_avatar];
            })
            .then((result) => {
                resolve(result);
                return result;
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export {updateProfilePhotos}