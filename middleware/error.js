import winston from 'winston';

export function error(err, req, res, next) {
  winston.error(err.message, err);

  res.status(500).send('Something failed.');
}
