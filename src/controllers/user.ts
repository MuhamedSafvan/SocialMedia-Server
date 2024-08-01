import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { badRequest } from "../err/APIError";
import {
  CustomRequest,
  generateJWTTokenForUser,
  hideUserAttributes,
} from "../utility/utility";
import Logger from "../err/APILogger";

/*-----------------
 * Get User By ID
 *----------------*/
export const getUser = async (req: CustomRequest, res: Response) => {
  const userProfile = req.userProfile;
  const { userId } = req.query;

  try {
    if (userId) {
      const user = await UserModel.findById(userId);
      hideUserAttributes(user, true);
      return res.json({ user });
    }
    hideUserAttributes(userProfile, true);

    Logger.Info(req, `user>getUser: ${userProfile?._id} data returned`);
    res.json({ user: userProfile });
  } catch (error: any) {
    throw badRequest(error.message, req);
  }
};

/*-----------------
 * Get User Friends
 *----------------*/
export const getUserFriends = async (req: CustomRequest, res: Response) => {
  const userProfile = req.userProfile;
  const { userId } = req.query;
  try {
    let friendList = userProfile?.friends;
    if (userId) {
      const user = await UserModel.findById(userId);
      friendList = user?.friends;
    }

    const friends = await Promise.all(
      (friendList ?? []).map((id: any) =>
        UserModel.findById(id)
          .select("_id firstName lastName occupation location profilePic")
          .lean()
      )
    );

    Logger.Info(req, `user>getUserFriends: ${userProfile?._id} data returned`);
    res.json(friends);
  } catch (error: any) {
    throw badRequest(error.message, req);
  }
};

/*-----------------
 * Update User Friends
 *----------------*/
export const updateUserFriends = async (req: CustomRequest, res: Response) => {
  const friendId = req.params.id;
  const userProfile = req.userProfile;
  try {
    const user = await UserModel.findById(userProfile?._id);
    const friend = await UserModel.findById(friendId);

    if (user?.friends.includes(friendId as any)) {
      user.friends = user.friends.filter(
        (id) => String(id) !== String(friendId)
      );
      friend!.friends = friend!.friends.filter(
        (id) => String(id) !== String(userProfile?._id)
      );
    } else {
      user?.friends.push(friendId as any);
      friend?.friends.push(userProfile?._id as any);
    }
    await user?.save();
    await friend?.save();

    const friends = await Promise.all(
      (user?.friends ?? []).map((id: any) =>
        UserModel.findById(id)
          .select("_id firstName lastName occupation location profilePic")
          .lean()
      )
    );
    Logger.Info(
      req,
      `user>updateUserFriends: ${userProfile?._id} friends updated`
    );

    res.json(friends);
  } catch (error: any) {
    throw badRequest(error.message, req);
  }
};
