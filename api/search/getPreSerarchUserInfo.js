import db from '../dbPromiseConnect'

const getPreSearchUserInfo = (id) => {

        return new Promise((resolve, reject) => {
            db.get().then(connection => {
                const sql = 'SELECT users.rate, users.location, users.sex, users.orientation, ' +
                    '        TIMESTAMPDIFF(YEAR, users.bday, CURDATE()) AS age ' +
                    '        FROM users WHERE users.id = ?';
                return connection.query(sql, [id]);
            }).then((result) => {
                resolve(result);
            }).catch(reason => reject(reason));
        });
};


export {getPreSearchUserInfo}