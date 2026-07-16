import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/users";
import roleSlice from "./slices/roles";
import permissionSlice from "./slices/permissions";

export default combineReducers({
  users: userSlice,
  roles: roleSlice,
  permissions: permissionSlice,
});
