import db from './dbPromiseConnect';

const getProfile = (id) => {

    return new Promise((resolve, reject) => {

        db.get().then((connection) => {

            const sql = 'SELECT ' +
                'users.id, ' +
                '    users.login, ' +
                '    users.name, ' +
                '    users.lastName, ' +
                '    users.email, ' +
                '    users.sex, ' +
                '    users.orientation, ' +
                '    users.rate, ' +
                '    users.location, ' +
                '    users.bio, ' +
                '    TIMESTAMPDIFF(YEAR, users.bday, CURDATE()) AS age, ' +
                '    users.bday, ' +
                '    users.is_online, ' +
                '    users.has_access, ' +
                '    DATE_FORMAT(users.last_seen, "(last seen at %H:%i, %Y-%m-%d)") as last_seen, ' +
                '    DATE_FORMAT(users.bday, "%Y-%m-%d") as dob, ' +
                '    GROUP_CONCAT( ' +
                '        DISTINCT url ' +
                'ORDER BY ' +
                'is_avatar ' +
                'DESC SEPARATOR ' +
                '\',\' ' +
                ') AS photos ' +
                'FROM ' +
                'users ' +
                'LEFT JOIN photo ON users.id = photo.user_id ' +
                'WHERE ' +
                'users.id = ? ' +
                'GROUP BY ' +
                'users.id';

            return connection.query(sql, [id]);
        }).then((result) => {
            if (result.length !== 0) {
                resolve(result);
            }
        }).catch((error) => {
            reject(error);
        });
    });

};

export {getProfile}