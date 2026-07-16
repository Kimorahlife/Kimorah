import { createAction } from "@reduxjs/toolkit";
import { ApiCallPayload } from "../types";

export const apiCallBegan = createAction<ApiCallPayload>("api/CallBegan");
export const apiCallSuccess = createAction<ApiCallPayload>("api/CallSuccess");
export const apiCallFailed = createAction<ApiCallPayload>("api/CallFailed");
