import { Response } from "express";
import { CustomRequest } from "../utility/utility";
import { badRequest } from "../err/APIError";
import { PostModel } from "../models/post";

export const createPost = async (req: CustomRequest, res: Response) => {
  const userProfile = req.userProfile;

  const { description } = req.body;

  try {
    const newPost = new PostModel({
      description,
      postPath: req.file?.filename,
      user: userProfile?._id,
      likes: {},
      comments: [],
    });

    await newPost.save();

    const posts = await PostModel.find()
      .populate("user", "firstName lastName profilePic location occupation")
      .sort({
        createdAt: -1,
      });
    res.json(posts);
  } catch (error: any) {
    throw badRequest(error.message, req);
  }
};

export const getPosts = async (req: CustomRequest, res: Response) => {
  const { user } = req.query;

  try {
    let query: any = {};
    if (user) {
      query.user = user;
    }
    const posts = await PostModel.find(query)
      .populate("user", "firstName lastName profilePic location occupation")
      .sort({
        createdAt: -1,
      });
    res.json(posts);
  } catch (error: any) {
    throw badRequest(error.message, req);
  }
};

export const likePost = async (req: CustomRequest, res: Response) => {
  const userProfile = req.userProfile;
  const { postId } = req.params;

  try {
    const post = await PostModel.findById(postId).populate(
      "user",
      "firstName lastName profilePic location occupation"
    );
    const userId = String(userProfile?._id);

    console.log(post, postId);
    const isLiked = post?.likes.get(userId);

    if (isLiked) {
      post?.likes.delete(userId);
    } else {
      post?.likes.set(userId, true);
    }

    await post?.save();

    // const updatedPost = await PostModel.findByIdAndUpdate(
    //   postId,
    //   {
    //     likes: post?.likes,
    //   },
    //   { new: true }
    // );

    res.json(post);
  } catch (error: any) {
    throw badRequest(error.message, req);
  }
};
