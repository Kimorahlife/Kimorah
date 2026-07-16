export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string;
  schoolId?: string;
  phoneNumber?: string;
  userType?: "staff" | "student";
}

