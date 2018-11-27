import mysql from 'promise-mysql'

let pool = null;

exports.con = () => {
    pool =  mysql.createPool({
        host: 'localhost',
        user: 'matcha',
        password: 'matcha',
        database: 'matchaprod',
        connectionLimit: 5000
    });
};
exports.get = () => {
    return new Promise((resolve, reject) => {
            if (!pool) {
                reject(new Error('Missing database connection'));
            } else {
                resolve(pool)
            }
    });
};

