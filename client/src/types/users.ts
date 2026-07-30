// Why the user is joining Kimorah — captured at signup.
// Values must match the Intention enum in server/src/models/user-model.ts
export enum Intention {
  Professional = "professional",
  Client = "client",
  Explorer = "explorer",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string;
  intention?: Intention;
  schoolId?: string;
  phoneNumber?: string;
  userType?: "staff" | "student";
}

