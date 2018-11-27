import db from '../dbPromiseConnect'

import {getSearch} from "../search/getSortedByDistance";

const insertMessage = (data) => {
    return new Promise((resolve, reject) => {
        db.get()
            .then(connection => {
                const sql = 'INSERT INTO message (chat_id, text, sender_id) VALUES(?,?,?)';

                const res =  connection.query(sql, [data.chat_id, data.text, data.sender_id]);
               // connection.end();
                return res;
            })
            .then((result) => {
                resolve(result);
            })
            .catch( reason => {
            });
    });

};

export {insertMessage}