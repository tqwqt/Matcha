import db from './dbPromiseConnect';
import bcrypt from 'bcrypt'

const addUser = (data, token) => {

    return new Promise((resolve, reject) => {

        bcrypt.hash(data.password, 10).then((hash) => {

            db.get().then((connection) => {

                const sql = 'INSERT INTO users (login, email, name, lastName, token, password) VALUES(?, ?, ?, ?, ?, ?)';

                return connection.query(sql, [data.login, data.email, data.name, data.lastName, token, hash]);

            }).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });

        });

    });
};

export {addUser}