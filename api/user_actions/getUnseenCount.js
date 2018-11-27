import db from '../dbPromiseConnect'

const getUnseenMsgCount = (id) => {
    return new Promise((resolve, reject) => {
        db.get().then(connect => {
            return connect.query('SELECT' +
                '    sender_id,' +
                '    chat_id,' +
                '    COUNT(1) AS num ' +
                'FROM ' +
                'message ' +
                'INNER JOIN chat ON message.chat_id = chat.id ' +
                'WHERE ' +
                'message.sender_id IN(' +
                '    SELECT' +
                '    (chat.user1_id + chat.user2_id) - ? AS ID ' +
                'FROM ' +
                'chat ' +
                'WHERE ' +
                '( ' +
                '    chat.user1_id = ? AND chat.user2_id != ? ' +
                ') OR( ' +
                '    chat.user1_id != ? AND chat.user2_id = ? ' +
                ') ' +
                ') AND is_seen = 0 AND chat_id IN ( ' +
                '    SELECT id FROM chat ' +
                'WHERE ' +
                '( ' +
                '    chat.user1_id = ? AND chat.user2_id != ? ' +
                ') OR( ' +
                '    chat.user1_id != ? AND chat.user2_id = ? ' +
                ') ' +
                ') AND chat.is_active = 1 ' +
                'GROUP BY ' +
                'chat.id, ' +
                '    message.sender_id',[id, id, id, id, id,id,id,id,id]);
        }).then((data) => {
            resolve(data);
        }).catch(reason => {
            reject(reason);
        });
    });
};
export {getUnseenMsgCount}
// SELECT
// sender_id,
//     chat_id,
//     COUNT(1) AS num
// FROM
// message
// INNER JOIN chat ON message.chat_id = chat.id
// WHERE
// message.sender_id IN(
//     SELECT
//     (chat.user1_id + chat.user2_id) - 39 AS ID
// FROM
// chat
// WHERE
// (
//     chat.user1_id = 39 AND chat.user2_id != 39
// ) OR(
//     chat.user1_id != 39 AND chat.user2_id = 39
// )
// ) AND is_seen = 0 AND chat_id IN(
//     SELECT
// id
// FROM
// chat
// WHERE
// (
//     chat.user1_id = 39 AND chat.user2_id != 39
// ) OR(
//     chat.user1_id != 39 AND chat.user2_id = 39
// )
// ) AND chat.is_active = 1
// GROUP BY
// chat.id,
//     message.sender_id