import { Schema } from "mongoose";
import { IPermission } from "../models/permission-model";

export const permissionSchema = new Schema<IPermission>(
  {
    key:    { type: String, required: true, unique: true },
    label:  { type: String, required: true },
    group:  { type: String, required: true },
    action: { type: String, enum: ["read", "add", "write", "delete"], required: true },
  },
  { timestamps: true }
);
