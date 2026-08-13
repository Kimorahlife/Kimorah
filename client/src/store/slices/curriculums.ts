import { createSlice } from "@reduxjs/toolkit";
import { curriculumSlice } from "../types";
import { apiCallBegan } from "../actions/api";
import { AppDispatch } from "../store";
import { Curriculum } from "../../views/curriculum/curriculum-types";

const initialState: curriculumSlice = {
  list: [],
  loading: false,
  error: null,
  processing: false,
  processError: null,
};

const CurriculumSlice = createSlice({
  name: "curriculums",
  initialState,
  reducers: {
    curriculumProcessErrorReset: (c) => {
      c.processError = "";
    },
    curriculumProcessFailed: (c, action) => {
      c.processError = action.payload;
      c.processing = false;
    },
    curriculumProcessRequested: (c) => {
      c.processing = true;
      c.processError = null;
    },
    curriculumRequested: (c) => {
      c.loading = true;
      c.error = null;
    },
    curriculumRequestFailed: (c, action) => {
      c.loading = false;
      c.error = action.payload;
    },
    curriculumReceived: (c, action) => {
      c.list = action.payload;
      c.loading = false;
      c.error = null;
    },
    curriculumAdded: (c, action) => {
      c.list.push(action.payload);
      c.processing = false;
      c.processError = null;
    },
    curriculumUpdated: (c, action) => {
      const updated: Curriculum = action.payload;
      const idx = c.list.findIndex((x) => x._id === updated._id);
      if (idx !== -1) c.list[idx] = updated;
      c.processing = false;
      c.processError = null;
    },
    // The api middleware dispatches `response.data.message`, and the delete
    // endpoint answers with the removed document — so match on its _id rather
    // than expecting a bare id in the payload.
    curriculumDeleted: (c, action) => {
      const removed: Curriculum = action.payload;
      c.list = c.list.filter((x) => x._id !== removed?._id);
      c.processing = false;
      c.processError = null;
    },
  },
});

const {
  curriculumAdded,
  curriculumDeleted,
  curriculumReceived,
  curriculumRequested,
  curriculumRequestFailed,
  curriculumUpdated,
  curriculumProcessRequested,
  curriculumProcessFailed,
  curriculumProcessErrorReset,
} = CurriculumSlice.actions;

export default CurriculumSlice.reducer;

export const loadCurriculums =
  (token: string | null) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/curriculums/all",
        headers: { Authorization: `Bearer ${token}` },
        onStart: curriculumRequested.type,
        onSuccess: curriculumReceived.type,
        onError: curriculumRequestFailed.type,
      })
    );

export const addCurriculum =
  (token: string | null, curriculum: Curriculum) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/curriculums/create",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: curriculum,
        onStart: curriculumProcessRequested.type,
        onSuccess: curriculumAdded.type,
        onError: curriculumProcessFailed.type,
      })
    );

export const updateCurriculum =
  (token: string | null, curriculum: Curriculum) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/curriculums/" + curriculum._id,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        data: curriculum,
        onStart: curriculumProcessRequested.type,
        onSuccess: curriculumUpdated.type,
        onError: curriculumProcessFailed.type,
      })
    );

export const deleteCurriculum =
  (token: string | null, id: string) => async (dispatch: AppDispatch) =>
    dispatch(
      apiCallBegan({
        url: "/api/curriculums/" + id,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        onStart: curriculumProcessRequested.type,
        onSuccess: curriculumDeleted.type,
        onError: curriculumProcessFailed.type,
      })
    );

export const closeCurriculumError = () => async (dispatch: AppDispatch) =>
  dispatch({ type: curriculumProcessErrorReset.type, payload: null });
