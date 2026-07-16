export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  assignable?: boolean;
  isGlobal?: boolean;
}