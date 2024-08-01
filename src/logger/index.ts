import buildDevLogger from "./dev-logger";
import buildProdLogger from "./prod-logger";
import { Logger } from "winston";

let logger: Logger;

if (process.env.DEV === "true") {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;
