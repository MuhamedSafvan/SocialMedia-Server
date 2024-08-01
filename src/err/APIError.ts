import Logger from "./APILogger";
import { Request } from "express";

class APIError extends Error {
  public code: number;

  constructor(code: number, message: string, error?: Error) {
    super(message);
    this.code = code;
    this.message = message;
  }

  static authFailed(message: string, req: Request): APIError {
    Logger.Error(req, message); // Pass null as the third argument or provide an appropriate error object
    return new APIError(401, message);
  }

  static badRequest(message: string, req: Request, error?: Error): APIError {
    Logger.Error(req, message, error);
    return new APIError(400, message, error);
  }

  static internal(message: string, req: Request): APIError {
    Logger.Error(req, message);
    return new APIError(500, message);
  }

  static notFound(message: string, req: Request): APIError {
    Logger.Error(req, message);
    return new APIError(404, message);
  }

  static customError(code: number, message: string, req: Request) {
    Logger.Error(req, message);
    if (code && code < 500) {
      return new APIError(code, message);
    } else {
      return new APIError(400, message);
    }
  }
}

export default APIError;
export const badRequest = APIError.badRequest;
export const authFailed = APIError.authFailed;
export const internal = APIError.internal;
export const notFound = APIError.notFound;
export const customError = APIError.customError;
