import config from 'config';
import morgan from 'morgan';
import helmet from 'helmet';
import debug from 'debug';
import { log } from './middleware/logger.js';
import { book as books } from './routes/books.js';
import { customer as customers } from './routes/customers.js';
import { user as users } from './routes/users.js';
import { auth } from './routes/auth.js';
import { home } from './routes/home.js';
import mongoose from 'mongoose';
import express from 'express';
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/bookstore')
  .then(() => debug('Connected to MongoDB...'))
  .catch((err) => debug('Could not connect to MongoDB...'.err));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/', home);
app.use('/api/books', books);
app.use('/api/customers', customers);
app.use('/api/users', users);
app.use('/api/auth', auth);

debug('Application Name: ' + config.get('name'));
debug('Mail Server: ' + config.get('mail.host'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
}

app.use(log);

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));
