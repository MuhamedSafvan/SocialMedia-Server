import { Schema, Document, model } from "mongoose";
import { v1 as uuidv1 } from "uuid";
import crypto from "crypto";

/*-------------------------------------------------------------
 * User Schema
 *-------------------------------------------------------------*/
enum UserType {
  Admin = "Admin",
  User = "User",
}

interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  name?: string;
  profilePic?: string;
  email?: string;
  friends: IUser[];
  location?: string;
  occupation?: string;
  viewedProfile?: number;
  impressions?: number;
  hashed_password: string;
  salt: string;
  //   userType: UserType;
  isActive: boolean;
  resetPasswordLink: string;
  externalId: string;
  id: string;
  _password?: string;
  password: string;
  encryptPassword(password: string): string;
  authenticate(plainText: string): boolean;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, trim: true, required: true, min: 2, max: 50 },
    lastName: { type: String, trim: true, required: true, min: 2, max: 50 },
    email: { type: String, trim: true, required: true, unique: true },
    profilePic: { type: String, trim: true },
    location: { type: String, trim: true },
    occupation: { type: String, trim: true },
    viewedProfile: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],

    hashed_password: { type: String },
    salt: { type: String, trim: true },
    isActive: { type: Boolean, default: false },
    resetPasswordLink: { type: String, default: "" },
    externalId: { type: String, default: "" },
    // userType: { type: String, enum: Object.values(UserType), default: UserType.User },
  },
  { timestamps: true }
);

userSchema.index({ resetPasswordLink: 1 }, { background: true, sparse: true });

// virtual field
userSchema
  .virtual("password")
  .set(function (this: IUser, password: string) {
    // create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv1();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function (this: IUser) {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (this: IUser, plainText: string): boolean {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (this: IUser, password: string): string {
    if (!password) return "";
    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
    } catch (err) {
      return "";
    }
  },
};

const UserModel = model<IUser>("User", userSchema);

export { UserModel, IUser };
