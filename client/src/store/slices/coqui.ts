import { createSlice } from "@reduxjs/toolkit";
import { coquiSlice } from "../types";
import { AppDispatch } from "../store";
import { api } from "../../api";

const initialState: coquiSlice = {
  data: null,
  loaded: false,
  loading: false,
  error: "",
};

const CoquiSlice = createSlice({
  name: "coqui",
  initialState,
  reducers: {
    coquiRequested: (coqui) => {
      coqui.loading = true;
      coqui.error = "";
    },
    coquiReceived: (coqui, action) => {
      coqui.data = action.payload;
      coqui.loaded = true;
      coqui.loading = false;
      coqui.error = "";
    },
    coquiRequestFailed: (coqui, action) => {
      coqui.error = action.payload;
      coqui.loading = false;
    },
  },
});

const { coquiRequested, coquiReceived, coquiRequestFailed } = CoquiSlice.actions;
export default CoquiSlice.reducer;

// The aggregates endpoint returns the object at the top level (response.data),
// not wrapped in a `.message` field, so we call the API directly rather than
// going through the apiCallBegan middleware (which assumes `.message`).
export const loadCoquiAggregates = (lang: string = "en") => async (dispatch: AppDispatch) => {
  dispatch(coquiRequested());
  try {
    const res = await api.get("/api/research/coqui/aggregates", { params: { lang } });
    if (res.data && typeof res.data === "object" && typeof res.data.totalParticipants === "number") {
      dispatch(coquiReceived(res.data));
    } else {
      const kind = typeof res.data === "string" ? "HTML/text (wrong URL?)" : "an object without totalParticipants";
      dispatch(coquiRequestFailed(`unexpected response — got ${kind}`));
    }
  } catch (error: any) {
    dispatch(coquiRequestFailed(error?.message ?? "request failed"));
  }
};
