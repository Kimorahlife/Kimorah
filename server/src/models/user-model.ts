import mongoose, { Model, Document, Schema } from "mongoose";

// Why the user is joining Kimorah — captured at signup and STORED ONLY.
//
// It is NOT a role and grants nothing. Authorization is driven entirely by the
// user's `roles` value and the permission matrix behind it; this field is kept
// solely as a segmentation variable for future email campaigns. Do not
// authorize on it, and do not render it anywhere it could be mistaken for a
// role.
enum Intention {
  Professional = "professional",
  Client = "client",
  Explorer = "explorer",
}

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  roles?: string;
  intention?: Intention;
  isVerified?: boolean;
  phoneNumber?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  isProtected?: boolean;
}

export interface UserModel extends Model<IUser & Document> {
  findByEmail(email: string): Promise<IUser | null>;
  findByName(name: string): Promise<IUser[]>;
  updateByEmail(email: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteByEmail(email: string): Promise<IUser>;
  updateById(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, minlength: 6 },
    roles: { type: String, required: false },
    intention: { type: String, enum: Object.values(Intention), required: false },
    isVerified: { type: Boolean, required: true, default: false },
    phoneNumber: { type: String, required: false },
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Date, required: false },
    isProtected: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.statics.findByName = function (name: string) {
  return this.find({ name }).exec();
};
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).exec();
};
userSchema.statics.updateByEmail = function (email: string, updateData: Record<string, any>) {
  return this.findOneAndUpdate({ email }, { $set: updateData }, { new: true, runValidators: true }).exec();
};
userSchema.statics.deleteByEmail = function (email: string) {
  return this.findOneAndDelete({ email }).exec();
};
userSchema.statics.updateById = function (id: string, updateData: Record<string, any>) {
  return this.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).exec();
};

const Users = mongoose.model<IUser, UserModel>("Users", userSchema);
export { Users, IUser, Intention };
