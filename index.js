import config from 'config';
import morgan from 'morgan';
import helmet from 'helmet';
import debug from 'debug';
import { log } from './middleware/logger.js';
import { booksRouter } from './routes/books.js';
import { home } from './routes/home.js';
import express from 'express';
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/books', booksRouter);
app.use('/', home);

debug('Application Name: ' + config.get('name'));
debug('Mail Server: ' + config.get('mail.host'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

app.use(log);

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));
