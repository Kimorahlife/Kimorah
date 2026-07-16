import { createSlice } from "@reduxjs/toolkit";
import { userSlice } from "../types";
import { AppDispatch } from "../store";
import { apiCallBegan } from "../actions/api";
import { User } from "../../types/users";
import { api } from "../../api";

const initialState: userSlice = {
  list: [],
  loading: false,
  error: "",
  processing: false,
  processError: "",
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userProcessErrorReset: (users) => {
      users.processError = "";
    },
    userProcessFailed: (users, action) => {
      users.processError = action.payload;
      users.processing = false;
    },
    userProcessRequested: (users) => {
      users.processing = true;
    },
    userRequestFailed: (users, action) => {
      users.error = action.payload;
      users.loading = false;
    },
    userRequested: (users) => {
      users.loading = true;
      users.error = null;
    },
    userReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
      users.error = "";
      users.processing = false;
    },
    userAdded: (users, action) => {
      users.list.push(action.payload);
      users.processing = false;
    },
    userDeleted: (users, action) => {
      const id = action.payload;
      return {
        ...users,
        processing: false,
        list: users.list.filter((u) => (u._id ?? u._id) !== id),
      };
    },
    userUpdated: (users, action) => {
      const updated = action.payload;
      const idx = users.list.findIndex((u) => u._id === updated._id);
      if (idx !== -1) users.list[idx] = updated;
      users.processing = false;
    },
  },
});

const {
  userAdded,
  userDeleted,
  userReceived,
  userRequested,
  userRequestFailed,
  userUpdated,
  userProcessRequested,
  userProcessFailed,
  userProcessErrorReset,
} = UserSlice.actions;
export default UserSlice.reducer;

export const loadUsers =
  (token: string | null) => async (dispatch: AppDispatch) => {
    return dispatch(
      apiCallBegan({
        url: "/api/users/all",
        headers: { Authorization: `Bearer ${token}` },
        onSuccess: userReceived.type,
        onStart: userRequested.type,
        onError: userRequestFailed.type,
      })
    );
  };

export const addUser =
  (token: string | null, user: User) => async (dispatch: AppDispatch) => {
    return dispatch(
      apiCallBegan({
        url: "/api/users/" + user._id,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        data: user,
        onSuccess: userAdded.type,
        onStart: userProcessRequested.type,
        onError: userProcessFailed.type,
      })
    );
  };

export const updateUser =
  (token: string | null, user: User) => async (dispatch: AppDispatch): Promise<User> => {
    dispatch(userProcessRequested());

    try {
      const response = await api.put(`/api/users/${user._id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Normalize _id to the original string format so userUpdated's findIndex
      // always matches — the server response _id may differ in type (ObjectId vs string).
      const updated: User = { ...response.data.message, _id: user._id };
      dispatch(userUpdated(updated));
      return updated;
    } catch (error: any) {
      const msg = error.response?.data?.message ?? error.message;
      dispatch(userProcessFailed(null));
      throw new Error(msg);
    }
  };

export const deleteUser =
  (token: string | null, id: string) => async (dispatch: AppDispatch) => {
    return dispatch(
      apiCallBegan({
        url: "/api/users/" + id,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        onSuccess: userDeleted.type,
        onStart: userProcessRequested.type,
        onError: userProcessFailed.type,
      })
    );
  };

export const closeError = () => async (dispatch: AppDispatch) =>
  dispatch({ type: userProcessErrorReset.type, payload: null });
