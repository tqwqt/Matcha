 import db from './dbPromiseConnect';

const hasToAccess = (id) => {

    return new Promise((resolve, reject) => {


        db.get().then(connection => {
            const query = 'SELECT ' +
                '    users.sex, ' +
                '    users.orientation, ' +
                '    users.bday, ' +
                '    users.bio, ' +
                '    photo.url, ' +
                '    GROUP_CONCAT( ' +
                '        DISTINCT tag ' +
                '    ORDER BY ' +
                '        tags.id ' +
                '    DESC SEPARATOR ' +
                '        \',\' ' +
                '    ) AS tags ' +
                'FROM ' +
                '    users ' +
                'LEFT JOIN photo ON photo.user_id = ? AND photo.is_avatar = 1 ' +
                'LEFT JOIN tags ON tags.user_id = users.id ' +
                'WHERE ' +
                '    users.id = ? ' +
                '    GROUP BY photo.url';

            return connection.query(query, [id, id]);
        }).then( result => {
            resolve(result);
        }).catch( reason => {
            reject(reason);
        });
    });

};

export {hasToAccess}