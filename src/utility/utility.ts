import multer from "multer";
import { IUser, UserModel } from "../models/user";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { badRequest } from "../err/APIError";

/*FILE STORAGE*/

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "src/public/assets");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

export interface CustomRequest extends Request {
  clientIP?: string;
  userProfile?: IUser | null;
  // file?: any;
}

/*---------------------------------------------------
 * Function to hide User attributes from Response
 *---------------------------------------------------*/
export const hideUserAttributes = (user: any, reset: boolean): void => {
  user.salt = undefined;
  user.hashed_password = undefined;
  if (reset) user.resetPasswordLink = undefined;
  user.updatedAt = undefined;
  user.__v = undefined;
};

/*---------------------------------------------------
 * Function to generate JWT token for LoggedIn User
 *---------------------------------------------------*/
export const generateJWTTokenForUser = (user: IUser): string => {
  const payload = {
    _id: user.id,
    firstName: user.firstName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.USER_CACHE!,
  });

  return token;
};

/*--------------------------------------------
 * Middleware to Validate the User from token
 *-------------------------------------------*/
export const validateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    const found = await UserModel.findById(user._id);

    // If not found, return UnAuthorized message
    if (!found) {
      throw badRequest("Access denied", req);
    }
    req.userProfile = found;
    next();
  } else {
    throw badRequest("Token Missing. Access denied", req);
  }

  // To Parse JWT Token
  function parseToken(token: string) {
    try {
      return jwt.verify(token.split(" ")[1], `${process.env.JWT_SECRET}`) as { _id: string };
    } catch (err) {
      throw badRequest("Token Parse failed.", req);
    }
  }
};
