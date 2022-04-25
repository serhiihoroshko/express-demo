export function error(error, req, res, next) {
  res.status(500).send('Something failed.');
}
