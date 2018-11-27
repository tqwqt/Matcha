import db from '../dbPromiseConnect'
import * as bcrypt from "bcrypt";

const checkPassword = (id, password) => {

    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'SELECT password FROM users WHERE id =? AND token = \'verified\'';
                return connection.query(sql, [id]);
            })
            .then((result) => {
                if (result.length === 0)
                    reject(false);
                else if (result.length !== 0)
                {
                    bcrypt.compare(password, result[0].password, function(err, res) {
                        if (err)
                            reject(err);
                        if (res === true)
                        {
                            resolve(true);
                        }
                        else if (res === false) {
                            reject("Wrong password");
                        }
                    });
                }
            }).catch(reason => console.error(reason))
    });
};
export {checkPassword}