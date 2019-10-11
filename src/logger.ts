import winston, { format } from 'winston';

const level = process.env.LOG_LEVEL || 'debug';

// Winston Logging Levels
// 0: emerg
// 1: alert
// 2: crit
// 3: error
// 4: warning
// 5: notice
// 6: info
// 7: debug

const simpleErrorFormat = winston.format((info) => {
  const newInfo = { ...info };
  if (newInfo.level.includes('error')) {
    if (newInfo.stack) {
      const stack = newInfo.stack
        .split('\n')
        .slice(1)
        .join('\n');

      newInfo.message += `\n${stack}`;
    }

    if (newInfo.data) {
      const data = JSON.stringify(newInfo.data, null, 4)
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n');
      newInfo.message += `\n${data}`;
    }

    delete newInfo.code;
    delete newInfo.data;
    delete newInfo.stack;
  }

  return newInfo;
});

const logger = winston.createLogger({
  format: format.combine(format.colorize(), format.splat(), simpleErrorFormat(), format.simple()),
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
