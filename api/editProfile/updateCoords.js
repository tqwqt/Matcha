import db from '../dbPromiseConnect'

const updateCoords = (id, coords) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'UPDATE users SET location = POINT(?, ?) ' +
                    'WHERE id = ?';

                let latitude = 50.46843159;
                let longitude = 30.4518626;

                if (coords.latitude !== null) {
                    let latitude = coords.latitude;
                }

                if (coords.longitude !== null) {
                    let longitude = coords.longitude;
                }

                return connection.query(sql, [latitude, longitude, id]);
            })
            .then((result) => {
                resolve(result.affectedRows);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
export {updateCoords}