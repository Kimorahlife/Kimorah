import { Request, Response, NextFunction } from "express";
import { Roles } from "../models/roles-model";
import { Users } from "../models/user-model";
import HttpError from "../util/errors/http-error";
import { refreshCache } from "../services/permission-cache";
import { DEFAULT_ROLE_PERMISSIONS } from "../startup/boot";
import { ROLE_CODE_MAP } from "../config/role-codes";

interface RoleBody {
  name: string;
  permissions: string[];
  isGlobal?: boolean;
}

export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const roles = await Roles.find();
    res.status(200).json({ message: roles });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to fetch roles", 500));
  }
};

export const getRoleById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const role = await Roles.findById(req.params.id);
    if (!role) {
      return next(new HttpError("Role not found", 404));
    }
    res.status(200).json({ message: role });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to fetch role", 500));
  }
};

export const createRole = async (
  req: Request<{}, {}, RoleBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, permissions, isGlobal } = req.body;

  try {
    const seededPermissions = permissions?.length
      ? permissions
      : (DEFAULT_ROLE_PERMISSIONS[name] ?? []);
    const role = await Roles.create({
      name,
      permissions: seededPermissions,
      isGlobal: isGlobal ?? false,
    });
    await refreshCache(); // Must refresh cache after role change
    res.status(201).json({ message: role });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(new HttpError(`A role named '${name}' already exists.`, 400));
    }
    return next(new HttpError(error.message || "Failed to create role", 500));
  }
};

export const updateRole = async (
  req: Request<{ id: string }, {}, RoleBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { name, permissions, isGlobal } = req.body;

  try {
    const role = await Roles.findById(id);
    if (!role) {
      return next(new HttpError("Role not found", 404));
    }

    if (name !== undefined) role.name = name;
    if (permissions !== undefined) role.permissions = permissions;
    if (isGlobal !== undefined) role.isGlobal = isGlobal;

    await role.save();
    await refreshCache(); // Must refresh cache after role change
    res.status(200).json({ message: role });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to update role", 500));
  }
};

export const deleteRole = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const role = await Roles.findById(id);
    if (!role) {
      return next(new HttpError("Role not found", 404));
    }

    // Guard the system roles — deleting them would strip everyone's access.
    if (Object.values(ROLE_CODE_MAP).includes(role.name as any)) {
      return next(new HttpError(`Cannot delete the system role '${role.name}'.`, 403));
    }

    // Reassign any users holding this role back to the default User role,
    // then remove the role and refresh the RBAC cache.
    await Users.updateMany({ roles: role.name }, { $set: { roles: ROLE_CODE_MAP.User } });
    await Roles.findByIdAndDelete(id);
    await refreshCache();

    res.status(200).json({ message: id });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to delete role", 500));
  }
};
