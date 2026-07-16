import { createSlice } from "@reduxjs/toolkit";
import { permissionSlice } from "../types";
import { apiCallBegan } from "../actions/api";
import { AppDispatch } from "../store";
import { Permission } from "../../types/permissions";

const initialState: permissionSlice = {
  list: [],
  loading: false,
  error: null,
  processing: false,
  processError: null,
};

const PermissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    permissionProcessErrorReset: (state) => {
      state.processError = "";
    },
    permissionProcessFailed: (state, action) => {
      state.processError = action.payload;
      state.processing = false;
    },
    permissionProcessRequested: (state) => {
      state.processing = true;
    },
    permissionRequestFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    permissionRequested: (state) => {
      state.loading = true;
      state.error = null;
    },
    permissionReceived: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    permissionAdded: (state, action) => {
      state.list.push(action.payload);
      state.processing = false;
    },
    permissionDeleted: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((p) => p._id !== id);
      state.processing = false;
    },
    permissionUpdated: (state, action) => {
      const updated: Permission = action.payload;
      const idx = state.list.findIndex((p) => p._id === updated._id);
      if (idx !== -1) state.list[idx] = updated;
      state.processing = false;
    },
  },
});

const {
  permissionAdded,
  permissionDeleted,
  permissionReceived,
  permissionRequested,
  permissionRequestFailed,
  permissionUpdated,
  permissionProcessRequested,
  permissionProcessFailed,
  permissionProcessErrorReset,
} = PermissionSlice.actions;

export default PermissionSlice.reducer;

export const loadPermissions =
  (token: string | null) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/permissions/all",
        headers: { Authorization: `Bearer ${token}` },
        onSuccess: permissionReceived.type,
        onStart: permissionRequested.type,
        onError: permissionRequestFailed.type,
      })
    );

export const addPermission =
  (token: string | null, permission: Omit<Permission, "_id">) =>
  async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/permissions/create",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: permission,
        onSuccess: permissionAdded.type,
        onStart: permissionProcessRequested.type,
        onError: permissionProcessFailed.type,
      })
    );

export const updatePermission =
  (token: string | null, permission: Permission) =>
  async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/permissions/" + permission._id,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        data: permission,
        onSuccess: permissionUpdated.type,
        onStart: permissionProcessRequested.type,
        onError: permissionProcessFailed.type,
      })
    );

export const deletePermission =
  (token: string | null, id: string) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/permissions/" + id,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        onSuccess: permissionDeleted.type,
        onStart: permissionProcessRequested.type,
        onError: permissionProcessFailed.type,
      })
    );

export const closePermissionError = () => async (dispatch: AppDispatch) =>
  dispatch({ type: permissionProcessErrorReset.type, payload: null });
