import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./db-error-handler";
import APIError from "./APIError";
import Logger from "./APILogger";

/*--------------------------------------------------------
 * Middleware to handle custom API Errors
 *--------------------------------------------------------*/
function apiErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // If error is a known API error
  if (err instanceof APIError) {
    Logger.Error(req, err.message);
    if (err.message.indexOf("Cast to ObjectId failed") !== -1) {
      return res.status(err.code).json({
        error: "Invalid Id format",
      });
    }
    res.status(err.code).json({
      error: err.message,
    });
    return;
  }

  // If error is a 404 (Not Found) error
  if (err.status === 404) {
    const endpoint = req.originalUrl?.split("?")[0]; // Extract the path without queries
    Logger.Error(req, `Route not found: ${req.method} ${endpoint}`);
    res.sendStatus(404);
    return;
  }

  Logger.Error(req, "Something went wrong!");

  return res.status(500).json({
    error: errorHandler(err) || "Something went wrong!",
  });
}

export default apiErrorHandler;
