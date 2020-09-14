import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint, colorize, errors,  } = format;

const logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: combine(
        // display stack trace on error (for func name)
        errors({ stack: true }), 
        colorize(),
        timestamp(),
        prettyPrint()
      ),
    }));
  }

  export { logger };