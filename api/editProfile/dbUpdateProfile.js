import db from '../dbPromiseConnect'

const updateProfile = (id, data) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'UPDATE users SET name = ?, lastName = ?, bday = ?, sex = ?, orientation = ?, bio = ? ' +
                    'WHERE id = ?';
                return connection.query(sql, [data.firstname, data.surname, data.bday, data.gender, data.orientation, data.bio, id]);
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export {updateProfile}
// UPDATE users SET location = POINT(30.464350, 30.466493)
// WHERE id = 8
