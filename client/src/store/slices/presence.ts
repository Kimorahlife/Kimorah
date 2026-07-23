import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { apiCallBegan } from "../actions/api";

type PresenceState = {
  ids: string[];
  loading?: boolean;
};

type MinimalUser = { _id?: string; id?: string };

const initialState: PresenceState = { ids: [] };

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    userLoading(user) {
      user.loading = true;
    },
    userIdPersisted(user, action: PayloadAction<MinimalUser[]>) {
      user.ids = Array.from(
        new Set(
          action.payload
            .map((u) => u._id ?? u.id)
            .filter((x): x is string => typeof x === "string")
        )
      );
      user.loading = false;
    },
    userAdded(users, action: PayloadAction<string>) {
      const id = action.payload;
      if (!users.ids.includes(id)) users.ids.push(id);
    },
    markOffline(users, action: PayloadAction<string>) {
      users.ids = users.ids.filter((x) => x !== action.payload);
    },
    resetPresence(users) {
      users.ids = [];
    },
  },
});

const { userIdPersisted, userAdded, markOffline, resetPresence, userLoading } =
  presenceSlice.actions;

export { resetPresence, userAdded, markOffline };

export default presenceSlice.reducer;

export const loadUserIds =
  (token: string | null) => async (dispatch: AppDispatch) => {
    return dispatch(
      apiCallBegan({
        url: "/api/users/all",
        headers: { Authorization: `Bearer ${token}` },
        onSuccess: userIdPersisted.type,
        onStart: userLoading.type,
      })
    );
  };
