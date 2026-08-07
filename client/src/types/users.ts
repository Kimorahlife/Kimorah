// Why the user is joining Kimorah — captured at signup and STORED ONLY.
//
// It is not a role and must never be rendered as one, gated on, or used to
// decide what a user can reach: access comes from the user's role and nothing
// else. It exists purely as a segmentation variable for future email
// campaigns. It was previously shown as a chip in the user list, where a
// "Professional" intention sat next to a "Professional" role and read as a
// duplicate role.
//
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

