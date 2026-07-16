import jwt, { JwtPayload } from "jsonwebtoken";
import HttpError from "../errors/http-error";

export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  name?: string;
  roles: string | undefined;
  isVerified?: boolean;
}

export function buildJwtPayload(
  decoded: DecodedToken,
): Omit<DecodedToken, "iat" | "exp"> {
  return {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    roles: decoded.roles,
    isVerified: decoded.isVerified,
  };
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new HttpError("JWT_SECRET is not configured", 500);
  }

  return secret;
};

export const generateJwtToken = (payload: DecodedToken): Promise<string> => {
  const normalizedPayload = buildJwtPayload(payload);
  return new Promise((resolve, reject) => {
    try {
      const secret = getJwtSecret();

      jwt.sign(normalizedPayload, secret, { expiresIn: "1d" }, (err, token) => {
        if (err || !token) {
          return reject(new HttpError("Error generating token", 500));
        }
        resolve(token);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const extractAndVerifyToken = (
  authorization?: string,
): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    try {
      if (!authorization) {
        return reject(
          new HttpError("Unable to verify token, authorization issue", 401),
        );
      }

      const token = authorization.split(" ")[1];
      const secret = getJwtSecret();

      jwt.verify(token, secret, (err, decoded) => {
        if (err || !decoded || typeof decoded !== "object") {
          return reject(new HttpError("Unable to verify token", 401));
        }

        resolve(decoded as DecodedToken);
      });
    } catch (error) {
      reject(error);
    }
  });
};
