import { createLogger, transports, format } from 'winston';
const { combine, timestamp, colorize, printf } = format;

const theLogFormat = printf(({ level, message, timestamp, ...rest }) => {
  return `${timestamp} | ${level} | ${message} | ${JSON.stringify(rest)}`;
});

export const requestLogger = createLogger({
  level: 'debug',
  transports: [new transports.Console()],
  format: combine(colorize(), timestamp(), theLogFormat),
})

const systemPrefixFormat = printf(({ message }) => {
  return `system: ${message}`;
})

export const systemLogger = createLogger({
  level: 'info',
  transports: [new transports.Console()],
  format: format.combine(
    systemPrefixFormat,
  ),
})

