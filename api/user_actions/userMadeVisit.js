import db from '../dbPromiseConnect'

const madeVisit = (who_id, whom_id) => {
    return new Promise((resolve, reject) => {
        db.get().then(connect => {
            return connect.query('INSERT INTO user_visits (who_id,whom_id, is_like) VALUES(?,?, 0)',[who_id,whom_id]);
        }).then(() => {
            resolve(false);
        }).catch(reason => {
            resolve(true);
        });
    });
};
export {madeVisit}
