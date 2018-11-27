import db from '../dbPromiseConnect'

const setRate = (profileId, value, isAlreadyVisited) => {

    return new Promise((resolve, reject) => {
        if (isAlreadyVisited === false){
            const compareSign =  value > 0 ? '<= 100': '>= 0';
            db.get()
                .then(connection => {
                    const sql = 'UPDATE users ' +
                        'INNER JOIN user_visits ' +
                        'SET rate = rate + '+value+
                        '        WHERE id = ? AND rate + '+value+ compareSign;
                    return connection.query(sql, [profileId]);
                })
                .then((result) => {
                    resolve(result.affectedRows);
                })
                .catch((error) => {
                    reject(error);
                });
        }else {
            resolve(false);
        }
    });
};
export {setRate}
// UPDATE users
// INNER JOIN user_visits
// SET rate = rate + -5
// WHERE id = 8 AND rate + -5 >=0 AND (user_visits.who_id != 9 AND user_visits.whom_id != 8)