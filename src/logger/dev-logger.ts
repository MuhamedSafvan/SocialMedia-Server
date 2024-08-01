import { format, transports, createLogger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { timestamp, combine, errors, printf } = format;

function buildDevLogger() {
  const logFormat = printf(({ level, message, timestamp, stack, ...info }) => {
    const { ip, cid, uid } = info;
    const metadataString = JSON.stringify({ ip, cid, uid }, (key, value) => (value === null ? undefined : value));
    return `${timestamp} ${metadataString} ${level}: ${stack || message}`;
  });

  return createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
    defaultMeta: { service: "api-service" },
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        filename: "./applogs-dev/zap-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
      }),
    ],
  });
}

export default buildDevLogger;
