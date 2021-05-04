const debug = require('debug')('app:startup');
const dbDebug = require('debug')('app:db');
import morgan from 'morgan';
import express from 'express';
const app = express();

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

dbDebug('Connected to the datebase...');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
