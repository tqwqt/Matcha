import db from './dbPromiseConnect';

const isEmailLoginExist = (email, login) => {

    return new Promise((resolve, reject) => {
       db.get().then((connection) => {

           const sql = 'SELECT * FROM users WHERE login = ? OR email = ?';
           return connection.query(sql, [login, email]);

       }).then((result) => {
           let errors = [];

           if (result.length !== 0) {
               result.forEach((item, i) => {
                   if (item.email.localeCompare(email) === 0) {
                       if (errors.includes('This email is already taken!') === false)
                       {errors.push('This email is already taken!')}
                   }
                   if (item.login.localeCompare(login) === 0) {
                       if (errors.includes('This login is already taken!') === false)
                       {errors.push('This login is already taken!')}
                   }
               });
           }
          resolve(errors);
       }).catch((error) => {
           reject(error);
       });
    });

};

export {isEmailLoginExist}