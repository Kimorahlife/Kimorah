import { Request, Response, NextFunction } from "express";
import { Users, IUser } from "../models/user-model";
import { ROLE_CODE_MAP } from "../config/role-codes";
import { listRoleNamesWithPermission } from "../services/permission-cache";
import HttpError from "../util/errors/http-error";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../util/jwt/jwt";

interface IUserAuth extends IUser {
  password: string;
}

export const loginUser = async (
  req: Request<{}, {}, IUserAuth>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user: IUser | null = await Users.findByEmail(email.toLowerCase());

    if (!user) {
      return next(new HttpError("Invalid email or password", 401));
    }

    const { _id: id, passwordHash, roles } = user;

    if (passwordHash == undefined) {
      return next(new HttpError("Internal Error", 500));
    }

    const isCorrect = await bcrypt.compare(password, passwordHash);

    if (!isCorrect) {
      return next(new HttpError("Invalid email or password", 401));
    }

    const payload = {
      id: id.toString(),
      name: user.name,
      email: email,
      roles: roles,
      isVerified: user.isVerified,
    };

    generateJwtToken(payload)
      .then((token) => {
        res.status(200).json({ token, message: id });
      })
      .catch((error) => {
        return next(
          new HttpError(`Error generating token: ${error.message || error}`, 500),
        );
      });
  } catch (err: any) {
    return next(new HttpError(`Login error: ${err.message}`, 500));
  }
};

export const signupUser = async (
  req: Request<{}, {}, IUserAuth>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const user = await Users.findByEmail(email.toLowerCase());
    if (user?.name !== undefined) {
      return next(new HttpError("User already exists, please login", 409));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let result;
    try {
      result = await Users.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        roles: ROLE_CODE_MAP.User,
        isVerified: false,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return next(new HttpError(`Signup db error with error: ${err.message}`, 500));
      }
      return next(new HttpError("Unknown error during signup db operation", 500));
    }

    const payload = {
      id: result._id.toString(),
      email: result.email,
      name: result.name,
      roles: result.roles,
      isVerified: result.isVerified,
    };

    generateJwtToken(payload)
      .then((token) => {
        res.status(200).json({ token });
      })
      .catch((error) => {
        return next(
          new HttpError(`Error generating token: ${error.message || error}`, 500),
        );
      });
  } catch (err: unknown) {
    return next(
      new HttpError(
        `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`,
        500,
      ),
    );
  }
};

export const getAllUsers = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const baseFilter: Record<string, unknown> = {};

    // Optional ?permission filter — narrows to users whose role holds the named
    // permission. NOTE: User.roles is a SCALAR string field, so `$in` matches
    // when the field value is contained in the array of role names.
    const permissionParam =
      typeof req.query.permission === "string" ? req.query.permission.trim() : "";

    if (permissionParam !== "") {
      const roleNames = listRoleNamesWithPermission(permissionParam);
      if (roleNames.length === 0) {
        res.status(200).json({ message: [] });
        return;
      }
      baseFilter.roles = { $in: roleNames };
    }

    const users = await Users.find(baseFilter, "-passwordHash");
    res.status(200).json({ message: users });
  } catch (error: any) {
    return next(new HttpError(`Get Users error: ${error.message || error}`, 500));
  }
};

export const getUserById = async (
  req: Request<{ pid: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await Users.findById(req.params.pid, "-passwordHash");
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json({ message: user });
  } catch (error: any) {
    return next(new HttpError(`Get user error: ${error.message || error}`, 500));
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, IUser>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { name, roles, isVerified, phoneNumber } = req.body;

  try {
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { $set: { name, roles, isVerified, phoneNumber } },
      { new: true, runValidators: true },
    ).select("-passwordHash");

    if (!updatedUser) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json({ message: updatedUser });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to update user", 500));
  }
};

export const deleteUser = async (
  req: Request<{ id: string }, {}, IUser>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const userToDelete = await Users.findById(id);

    if (!userToDelete) {
      return next(new HttpError("User not found", 404));
    }
    if (userToDelete.isProtected) {
      return next(new HttpError("Cannot delete a protected user", 403));
    }
    if (req.user!.id === id) {
      return next(new HttpError("Cannot delete the currently signed-in user", 400));
    }

    await Users.findByIdAndDelete(id);
    res.status(200).json({ message: id });
  } catch (error: any) {
    return next(new HttpError(`Delete user error: ${error.message || error}`, 500));
  }
};
