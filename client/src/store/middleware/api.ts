import { Middleware } from "@reduxjs/toolkit";
import axios from "axios";
import * as actions from "../actions/api";
import * as apiCall from "../../api";

function isApiCallBeganAction(
  action: unknown
): action is ReturnType<typeof actions.apiCallBegan> {
  return (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    (action as any).type === actions.apiCallBegan.type &&
    "payload" in action
  );
}
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const api: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (!isApiCallBeganAction(action)) return next(action);

    const {
      url,
      method = "GET",
      data,
      headers,
      onSuccess,
      onError,
      onStart,
    } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    try {
      //await sleep(1000); // this is great for testing purposes
      const response = await apiCall.api.request({
        url,
        method,
        data,
        headers,
      });
      dispatch(actions.apiCallSuccess(response.data.message));
      const payload = response.data?.message;
      if (onSuccess) {
        dispatch({ type: onSuccess, payload });
      }
    } catch (error: any) {
      const payload = error.response?.data?.message ?? error.message;
      dispatch(actions.apiCallFailed(error.response?.data?.message));
      if (onError) {
        dispatch({
          type: onError,
          payload: payload,
        });
      }
    }
  };

export default api;
