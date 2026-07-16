import mongoose, { Model } from "mongoose";
import { permissionSchema } from "../services/permission-service";

export interface IPermission {
  _id: mongoose.Types.ObjectId;
  key: string;
  label: string;
  group: string;
  action: "read" | "add" | "write" | "delete";
}

export interface PermissionModel extends Model<IPermission> {}

const Permission = mongoose.model<IPermission, PermissionModel>(
  "Permission",
  permissionSchema
);

export { Permission };
