import { Schema, Document, model } from "mongoose";
import { IUser } from "./user";

/*-------------------------------------------------------------
 * Post Schema
 *-------------------------------------------------------------*/

interface IPost extends Document {
  user: IUser;
  description?: string;
  postPath?: string;
  likes: Map<String, Boolean>;
  comments: string[];
}

const postSchema: Schema<IPost> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String, trim: true },
    postPath: { type: String, trim: true },
    likes: { type: Map, of: Boolean },
    comments: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const PostModel = model<IPost>("Post", postSchema);

export { PostModel, IPost };
