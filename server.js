'use strict';

const path = require('path');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const loggingMiddleware = (req, res, next) => {
    console.log('ip:', req.ip, req.url);
    next();
};

app.use(loggingMiddleware);

// const api = require('./backend/api/api')(models);
// app.use('/api', api);

// const tmp = require('./backend/tmp')(models);
// app.use('/tmp', tmp);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const srv = app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
//srv.setTimeout(10 * 60 * 1000);
