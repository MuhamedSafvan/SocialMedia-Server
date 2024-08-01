import logger from "../logger";
import { Request } from "express";
import { CustomRequest } from "../utility/utility";

class APILogger {
  private static getMetaData(req: CustomRequest) {
    let metaData: Record<string, any> = {};

    if (req) {
      if (req.userProfile) {
        metaData = { ip: req.clientIP, uid: req.userProfile?.id };
      } else {
        metaData = { ip: req.clientIP };
      }
    }

    return metaData;
  }

  static Info(req: Request, message: string) {
    logger.info(message, this.getMetaData(req));
  }

  static Warn(req: Request, message: string) {
    logger.error(message, this.getMetaData(req));
  }

  static Error(req: Request, message: string, error?: Error) {
    logger.error(message, error, this.getMetaData(req));
  }

  static Debug(req: Request, message: string) {
    logger.debug(message, this.getMetaData(req));
  }
}

const Logger = APILogger;
export default Logger;
