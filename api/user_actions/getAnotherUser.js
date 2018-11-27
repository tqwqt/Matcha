import db from '../dbPromiseConnect'

const getAnotherUser = (id, myId) => {
    return new Promise((resolve, reject) => {
        db.get().then(connect => {
            return connect.query('SELECT' +
                '    users.id,' +
                '    users.login,' +
                '    users.name,' +
                '    users.lastName,' +
                '    users.email,' +
                '    users.sex,' +
                '    users.orientation,' +
                '    users.rate,' +
                '    users.location,' +
                '    users.bio,' +
                '    users.is_online,' +
                '    users.last_seen, ' +
                '    user_visits.is_like,' +
                '    TIMESTAMPDIFF(YEAR, users.bday, CURDATE()) AS age,' +
                '    users.bday,' +
                '    GROUP_CONCAT(DISTINCT url' +
                '                      ORDER BY is_avatar DESC SEPARATOR \',\') as photos,' +
                '    GROUP_CONCAT(DISTINCT tag' +
                '    ORDER BY tags.id ' +
                '    DESC SEPARATOR \',\') AS tags ' +
                'FROM' +
                '    users' +
                '    INNER JOIN photo ON users.id = photo.user_id ' +
                '    INNER JOIN tags ON users.id = tags.user_id ' +
                '    INNER JOIN user_visits ON user_visits.whom_id = users.id ' +
                'WHERE' +
                '   users.id = ? AND user_visits.who_id = ? ' +
                '   GROUP BY users.id',[id, myId]);
        }).then((data) => {
            resolve(data);
        }).catch(reason => {
            reject(reason);
        });
    });
};
export {getAnotherUser}
// SELECT
// users.id,
//     users.login,
//     users.name,
//     users.lastName,
//     users.email,
//     users.sex,
//     users.orientation,
//     users.rate,
//     users.location,
//     users.bio,
//     TIMESTAMPDIFF(YEAR, users.bday, CURDATE()) AS age,
//     users.bday,
//     user_visits.is_like,
//     user_visits.is_connected,
//     GROUP_CONCAT(
//         DISTINCT url
// ORDER BY
// is_avatar
// DESC SEPARATOR
// ','
// ) AS photos,
//     GROUP_CONCAT(DISTINCT tag
// ORDER BY tags.id
// DESC SEPARATOR
// ',') AS tags
// FROM
// users
// INNER JOIN photo ON users.id = photo.user_id
// INNER JOIN tags ON users.id = tags.user_id
// INNER JOIN user_visits ON user_visits.whom_id = users.id
// WHERE
// users.id = 9 AND user_visits.who_id = 8
// GROUP BY
// users.id