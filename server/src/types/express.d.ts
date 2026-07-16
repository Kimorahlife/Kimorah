import { DecodedToken } from "../util/jwt/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}
