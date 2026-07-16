import { createSlice } from "@reduxjs/toolkit";
import { roleSlice } from "../types";
import { apiCallBegan } from "../actions/api";
import { AppDispatch } from "../store";
import { Role } from "../../types/roles";

const initialState: roleSlice = {
  list: [],
  loading: false,
  error: null,
  processing: false,
  processError: null,
};

const RoleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    roleProcessErrorReset: (role) => {
      role.processError = "";
    },
    roleProcessFailed: (role, action) => {
      role.processError = action.payload;
      role.processing = false;
    },
    roleProcessRequested: (role) => {
      role.processing = true;
    },
    roleRequestFailed: (role, action) => {
      role.loading = false;
      role.error = action.payload;
    },
    roleRequested: (role) => {
      role.loading = true;
      role.error = null;
    },
    roleReceived: (role, action) => {
      role.list = action.payload;
      role.loading = false;
      role.error = null;
    },
    roleAdded: (role, action) => {
      role.list.push(action.payload);
      role.processing = false;
      role.processError = null;
    },
    roleDeleted: (role, action) => {
      const id = action.payload;
      return {
        ...role,
        list: role.list.filter((r) => r._id !== id),
        loading: false,
        processing: false,
      };
    },
    roleUpdated: (role, action) => {
      const updated: Role = action.payload;
      const idx = role.list.findIndex((r) => r._id === updated._id);
      if (idx !== -1) role.list[idx] = updated;
      role.processing = false;
      role.processError = null;
    },
  },
});

const {
  roleAdded,
  roleDeleted,
  roleReceived,
  roleRequested,
  roleRequestFailed,
  roleUpdated,
  roleProcessRequested,
  roleProcessFailed,
  roleProcessErrorReset,
} = RoleSlice.actions;

export default RoleSlice.reducer;

export const loadRoles =
  (token: string | null) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/roles/all",
        headers: { Authorization: `Bearer ${token}` },
        onSuccess: roleReceived.type,
        onStart: roleRequested.type,
        onError: roleRequestFailed.type,
      })
    );

export const addRole =
  (token: string | null, role: Omit<Role, "_id">) =>
  async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/roles/create",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: role,
        onSuccess: roleAdded.type,
        onStart: roleProcessRequested.type,
        onError: roleProcessFailed.type,
      })
    );

export const updateRole =
  (token: string | null, role: Role) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/roles/" + role._id,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        data: role,
        onSuccess: roleUpdated.type,
        onStart: roleProcessRequested.type,
        onError: roleProcessFailed.type,
      })
    );

export const deleteRole =
  (token: string | null, id: string) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/roles/" + id,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        onSuccess: roleDeleted.type,
        onStart: roleProcessRequested.type,
        onError: roleProcessFailed.type,
      })
    );

export const closeRoleError = () => async (dispatch: AppDispatch) =>
  dispatch({ type: roleProcessErrorReset.type, payload: null });