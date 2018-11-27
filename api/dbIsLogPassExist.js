import db from './dbPromiseConnect';
import bcrypt from 'bcrypt';


const isLogPassValid = (password, login) => {

    let errors = [];

    return new Promise((resolve, reject) => {

        db.get().then((connection) => {

            const sql = `SELECT * FROM users WHERE login = ? AND token = 'verified'`;

            return connection.query(sql, [login]);

        }).then((result) => {

            if (result.length !== 0) {

                bcrypt.compare(password, result[0].password, function(err, res) {
                    if (err) {
                        reject(err);
                    }
                    if (res === true)
                    {
                        resolve(result[0].id);
                    }
                    else if (res === false) {
                        errors.push('Invalid login or password');
                        resolve(errors);
                    }
                });

            } else {
                errors.push('Probably, you haven\'t verified your account by email yet or login/password pair do not match');
                resolve(errors);
            }

        }).catch((error) => {
            reject(error);
        });
    });
};

export {isLogPassValid}