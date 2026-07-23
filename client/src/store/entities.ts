import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/es/storage";
import { persistReducer } from "redux-persist";
import userSlice from "./slices/users";
import roleSlice from "./slices/roles";
import permissionSlice from "./slices/permissions";
import coquiSlice from "./slices/coqui";

// Persist the Coquí aggregates so a full page refresh shows the last-known
// numbers immediately (then a background refetch keeps them fresh).
const persistedCoqui = persistReducer({ key: "coqui", storage }, coquiSlice);

export default combineReducers({
  users: userSlice,
  roles: roleSlice,
  permissions: permissionSlice,
  coqui: persistedCoqui,
});
