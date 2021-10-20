/* istanbul ignore file */
import * as winston from 'winston';

// If `LOG_LEVEL` is not specified, default to `debug` for non-production or `warning` for production
const level =
  process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warning' : 'debug');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console({ level })],
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
});

export default logger;
