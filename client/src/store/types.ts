import { User } from "../types/users";
import { Role } from "../types/roles";
import { Permission } from "../types/permissions";
import { Curriculum } from "../views/curriculum/curriculum-types";

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

export interface curriculumSlice extends slice {
  list: Array<Curriculum>;
}

export interface permissionSlice extends slice {
  list: Array<Permission>;
}

export interface coquiSlice extends slice {
  // The aggregates object returned by GET /api/research/coqui/aggregates
  // (totalParticipants, countriesRepresented, topFeelings, …). Shape is
  // dynamic, so we keep it loosely typed here.
  data: Record<string, any> | null;
  loaded: boolean;
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
