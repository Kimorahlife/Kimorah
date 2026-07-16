import { User } from "../types/users";
import { Role } from "../types/roles";
import { Permission } from "../types/permissions";

interface slice {
  loading?: boolean;
  error?: string | null;
  processing?: boolean;
  processError?: string | null;
}

export interface userSlice extends slice {
  list: Array<User>;
}

export interface roleSlice extends slice {
  list: Array<Role>;
}

export interface permissionSlice extends slice {
  list: Array<Permission>;
}

export interface ApiCallPayload {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: unknown;
  headers?: Record<string, string>;
  onSuccess?: string;
  onError?: string;
  onStart?: string;
}
