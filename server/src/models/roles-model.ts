import mongoose, { Model, Schema } from "mongoose";

interface IRole {
  _id: mongoose.Types.ObjectId;
  name: string;
  permissions: string[];
  isGlobal?: boolean;
  bypassFeatureChecks?: boolean;
  assignable?: boolean;
}

export interface RoleModel extends Model<IRole> {}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], default: [] },
    isGlobal: { type: Boolean, default: false },
    bypassFeatureChecks: { type: Boolean, default: false },
    assignable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Roles = mongoose.model<IRole, RoleModel>("Roles", roleSchema);

export { Roles, IRole };
