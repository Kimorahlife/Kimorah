import reducer from "./reducer";
import api from "./middleware/api";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    reducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// Users
export const getUser = (state: RootState) => state.reducer.entities.users;

// Permissions
export const getPermission = (state: RootState) => state.reducer.entities.permissions;

// Roles
export const getRole = (state: RootState) => state.reducer.entities.roles;

// Coquí Research Data aggregates
export const getCoqui = (state: RootState) => state.reducer.entities.coqui;

// Persistor
export const persistor = persistStore(store);

export const getPersist = (state: RootState) => state.reducer.presence;

export const getOnlineUserIds = (s: RootState) => s.reducer.presence.ids;
