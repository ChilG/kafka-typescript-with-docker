import { LogEntry, logLevel } from 'kafkajs';
import winston from 'winston';
import chalk from 'chalk';

const toWinstonLogLevel = (level: logLevel) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
  }
};

export const WinstonLogCreator = (logLevel: logLevel) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(logLevel),
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.json(),
      winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
      winston.format.printf((info) => {
        const section1 = chalk.cyanBright(`[KAFKA]`);
        const section2 = `[${info.level}]`;
        const section3 = `: ${info.message} `;
        const section4 = chalk.dim(
          info['extra'] && typeof info['extra'] === 'object' ? JSON.stringify(info['extra']) : info['extra'] || '',
        );
        const section5 = `\n${chalk.grey.italic(`[${info.timestamp}]`)}`;

        return [section1, section2, section3, section4, section5].join('');
      }),
    ),
    transports: [new winston.transports.Console()],
    handleExceptions: true,
  });

  return ({ namespace, level, label, log }: LogEntry) => {
    const { message, ...extra } = log;
    logger.log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    });
  };
};
