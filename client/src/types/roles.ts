export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  assignable?: boolean;
  isGlobal?: boolean;
  /** The role new signups are given. At most one role carries this flag. */
  isDefault?: boolean;
}