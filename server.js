import config from './config';
import apiRouter from './api';
import db from './api/dbPromiseConnect';
// import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import socketBack from './api/socket/socketBack';
import bodyParser from 'body-parser';
import express from 'express';
//----------------------CHat---------------

//----------------------CHat---------------
import https  from 'https';
import {insertMessage} from "./api/chat/iinsertMessages";

// import fs from 'fs'
// const httpsOpt = {
//     cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
//     key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
// };

let server = express();
const http = require('http').Server(server);

// server.use(sassMiddleware({
//     src: path.join(__dirname, 'sass'),
//     dest: path.join(__dirname, 'public'),
//     indentedSyntax: false,
//     debug: true
// }));

server.set('view engine', 'ejs');

server.get(['/', '/cabinet/profile','/cabinet/chat', '/cabinet/search', '/cabinet/settings', '/cabinet/notifications', '/confirm/:login/:token', '/restoreData/:email/:token', '/cabinet/user/:id'], (req, res) => {
    res.render('index', {currentUrl: req.originalUrl});

});


server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use('/api', apiRouter);
server.use(express.static('public'));
db.con();
//------------
server.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});
//--
socketBack.connect(http);

http.listen(config.port, config.host, () => {
    console.info('Express listening on port', config.port);
});

//------------------sockets----------------//
// let io = require('socket.io').listen(se);

