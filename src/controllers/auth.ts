import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/user";
import { badRequest } from "../err/APIError";
import { generateJWTTokenForUser, hideUserAttributes } from "../utility/utility";
import Logger from "../err/APILogger";

/*---------------
 * User Sign-up
 *--------------*/
export const registerUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { firstName, lastName, email, password, profilePic, friends, location, occupation } = req.body;
  console.log(req.body);

  const userEmail = email.toLowerCase();

  try {
    const userExists = await UserModel.findOne({
      email: userEmail,
    }).session(session);

    if (userExists) {
      throw badRequest("Email is already taken!", req);
    }

    const newUser = new UserModel({
      email: userEmail,
      firstName,
      lastName,
      password,
      isActive: true,
      profilePic: req.file?.filename,
      friends,
      location,
      occupation,
    });

    let user = await newUser.save({ session });

    await session.commitTransaction();

    const finalUser = await UserModel.findById(user._id);

    // sendWelcomeMail(finalUser);

    const token = generateJWTTokenForUser(user);

    hideUserAttributes(finalUser, true);

    Logger.Info(req, `auth>signUp: ${user?.email} signed up`);

    res.json({ user: finalUser, token });
  } catch (error: any) {
    await session.abortTransaction();
    throw badRequest(error.message, req);
  } finally {
    await session.endSession();
  }
};

/*---------------
 * User Sign-In
 *--------------*/
export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const lowerEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: lowerEmail });

    if (!user) {
      throw badRequest(`User with email ${email} does not exist`, req);
    }

    if (!user.authenticate(password)) {
      throw badRequest("Email and password do not match", req);
    }

    const token = generateJWTTokenForUser(user);
    hideUserAttributes(user, true);

    Logger.Info(req, `auth>signIn: ${user?.email} signed in`);
    res.json({ user, token });
  } catch (error: any) {
    throw badRequest(error.message, req);
  }
};
