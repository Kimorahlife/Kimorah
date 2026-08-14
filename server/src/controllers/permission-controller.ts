import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Permission } from "../models/permission-model";
import { Roles } from "../models/roles-model";
import HttpError from "../util/errors/http-error";
import { refreshCache } from "../services/permission-cache";

interface PermissionBody {
  key: string;
  label: string;
  group: string;
  action?: "read" | "add" | "write" | "delete";
}

export const getAllPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const permissions = await Permission.find().sort({ group: 1, key: 1 });
    res.status(200).json({ message: permissions });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to fetch permissions", 500));
  }
};

export const createPermission = async (
  req: Request<{}, {}, PermissionBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { key, label, group, action } = req.body;

  try {
    const permission = await Permission.create({ key, label, group, action: action ?? "read" });
    res.status(201).json({ message: permission });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(new HttpError(`A permission with key '${key}' already exists.`, 400));
    }
    return next(new HttpError(error.message || "Failed to create permission", 500));
  }
};

export const updatePermission = async (
  req: Request<{ id: string }, {}, PermissionBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { key, label, group, action } = req.body;

  try {
    const permission = await Permission.findById(id);
    if (!permission) {
      return next(new HttpError("Permission not found", 404));
    }

    if (key !== undefined) permission.key = key;
    if (label !== undefined) permission.label = label;
    if (group !== undefined) permission.group = group;
    if (action !== undefined) permission.action = action;

    await permission.save();
    res.status(200).json({ message: permission });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to update permission", 500));
  }
};

export const deletePermission = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const perm = await Permission.findById(id);
    if (!perm) {
      return next(new HttpError("Permission not found", 404));
    }

    // Pull the deleted key out of every role that grants it, then refresh cache.
    // One transaction, for the same reason: a role must not keep a permission
    // key that no longer exists in the catalog.
    const tx = await mongoose.startSession();
    try {
      await tx.withTransaction(async () => {
        await Roles.updateMany({ permissions: perm.key }, { $pull: { permissions: perm.key } }, { session: tx });
        await Permission.findByIdAndDelete(id, { session: tx });
      });
    } finally {
      await tx.endSession();
    }
    await refreshCache();

    res.status(200).json({ message: id });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to delete permission", 500));
  }
};
