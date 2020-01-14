import 'reflect-metadata';
import app from './app';
import logger from './logger';

export const port = process.env.PORT || '3000';
const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});

export default server;
