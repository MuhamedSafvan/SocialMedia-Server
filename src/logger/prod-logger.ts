import { format, createLogger, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { timestamp, combine, errors, json } = format;

function buildProdLogger() {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: "api-service" },
    transports: [
      new DailyRotateFile({
        filename: "./applogs/zap-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
      }),
    ],
  });
}

export default buildProdLogger;
