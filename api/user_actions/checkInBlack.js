import db from '../dbPromiseConnect'

const checkInBlack = (who_id, whom_id) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'SELECT * FROM black_list WHERE who_id = ? AND whom_id = ?';
                return connection.query(sql, [who_id, whom_id]);
            })
            .then(result => {
                if (result.length === 0)
                    resolve(false);
                else
                    reject(true);
            })
            .catch(reject);
    });
    // let tt = db.db(() => {
    //     tt.query('SELECT * FROM black_list WHERE who_id = ? AND whom_id = ?', [who_id, whom_id], function (err, result) {
    //         return new Promise((resolve, reject)=>{
    //             if (err) {
    //                 return reject(err);
    //             }
    //             if (result.length === 0){
    //                 return resolve(false);
    //             }
    //             return resolve(true);
    //          });
    //     });
    //
    // });
    //
    // return true;
};
export {checkInBlack}