import { useState, useEffect } from "react";
import { useToken } from "./useToken";

interface UserPayload {
  id: string;
  email: string;
  name: string;
  roles: string;
  schoolId?: string; // Optional school ID for students
  userType?: "staff" | "student";
  iat: number;
  exp: number;
}

export const useUser = (): UserPayload | null => {
  const [token] = useToken("");

  const getPayloadFromToken = (token: string): UserPayload => {
    const encodedPayload = token.split(".")[1];
    return JSON.parse(atob(encodedPayload));
  };

  const [user, setUser] = useState<UserPayload | null>(() => {
    if (!token) return null;
    return getPayloadFromToken(token);
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
    } else {
      setUser(getPayloadFromToken(token));
    }
  }, [token]);

  return user;
};
