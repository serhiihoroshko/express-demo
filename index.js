import config from 'config';
import morgan from 'morgan';
import helmet from 'helmet';
import { log } from './middleware/logger.js';
import { book as books } from './routes/books.js';
import { customer as customers } from './routes/customers.js';
import { user as users } from './routes/users.js';
import { auth } from './routes/auth.js';
import { home } from './routes/home.js';
import { error } from './middleware/error.js';
import mongoose from 'mongoose';
import express from 'express';

const app = express();
const db = config.get('db');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect(db)
  .then(() => console.log(`Connected to ${db}...`))
  .catch((err) => console.log(`Could not connect to ${db}...`.err));

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
app.use(error);

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...');
}

app.use(log);

const port = process.env.PORT || 3000;
export const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
