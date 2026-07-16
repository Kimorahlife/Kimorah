import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

type UseTokenReturn = [string | null, (newToken: string) => void, boolean];

interface TokenPayload {
  exp: number;
  id: string;
  email: string;
  roles?: string;
  name?: string;
}

export const useToken = (p0?: string): UseTokenReturn => {
  const [token, setTokenInternal] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [isValid, setIsValid] = useState<boolean>(true);
  const location = useLocation(); // Add location to trigger validation on route changes

  // Validate token function
  const validateToken = useCallback((tokenToValidate: string): boolean => {
    try {
      const payload = JSON.parse(
        atob(tokenToValidate.split(".")[1]),
      ) as TokenPayload;
      const currentTime = Date.now() / 1000;
      const isValid = payload.exp > currentTime;
      // console.log("Token validation:", {
      //   isValid,
      //   expires: new Date(payload.exp * 1000),
      // });
      return isValid;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }, []);

  // Get token expiration time
  const getTokenExpirationTime = useCallback((tokenToCheck: string): number => {
    try {
      const payload = JSON.parse(
        atob(tokenToCheck.split(".")[1]),
      ) as TokenPayload;
      return payload.exp * 1000;
    } catch (error) {
      return 0;
    }
  }, []);

  // Check token validity
  const checkTokenValidity = useCallback((): boolean => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setIsValid(false);
      setTokenInternal(null);
      return false;
    }

    const valid = validateToken(currentToken);
    setIsValid(valid);

    if (!valid) {
      localStorage.removeItem("token");
      setTokenInternal(null);
    } else {
      setTokenInternal(currentToken);
    }

    return valid;
  }, [validateToken]);

  // Set new token
  const setToken = useCallback(
    (newToken: string): void => {
      if (validateToken(newToken)) {
        localStorage.setItem("token", newToken);
        setTokenInternal(newToken);
        setIsValid(true);
      } else {
        console.error("Invalid token provided");
        setIsValid(false);
      }
    },
    [validateToken],
  );

  // Remove token (logout)
  const removeToken = useCallback((): void => {
    localStorage.removeItem("token");
    setTokenInternal(null);
    setIsValid(false);
  }, []);

  // Enhanced validation that runs on mount and route changes
  useEffect(() => {
    checkTokenValidity();
  }, [location.pathname, checkTokenValidity]); // Add location.pathname as dependency

  // Periodic token validation
  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Set up interval to check token every 30 seconds
    const intervalId = setInterval(checkTokenValidity, 30000);

    // Set up timeout for exact token expiration
    const expirationTime = getTokenExpirationTime(token);
    const timeUntilExpiration = expirationTime - Date.now();

    let timeoutId: ReturnType<typeof setTimeout>;
    if (timeUntilExpiration > 0) {
      timeoutId = setTimeout(() => {
        checkTokenValidity();
      }, timeUntilExpiration);
    }

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, checkTokenValidity, getTokenExpirationTime]);

  return [token, setToken, isValid];
};
