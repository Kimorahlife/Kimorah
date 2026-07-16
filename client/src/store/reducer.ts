import { combineReducers } from "redux";
import entitiesReducer from "./entities";
import storage from "redux-persist/es/storage";
import { persistReducer } from "redux-persist";
import presenceReducer from "./slices/presence";

const persistedPresence = persistReducer(
  { key: "presence", storage },
  presenceReducer
);

export default combineReducers({
  entities: entitiesReducer,
  presence: persistedPresence,
});
