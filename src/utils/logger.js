import winston from "winston";

const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
const { combine, timestamp, colorize, printf } = winston.format;
const myFormat = printf(({ timestamp, level, message, ...info }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    info
  });
});

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    myFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" })
  ],
});
