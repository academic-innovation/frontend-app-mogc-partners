import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { ensureConfig, getConfig, camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Partnership API services');

const recordsAdapter = createEntityAdapter({
  selectId: record => record.id,
});

const initialState = recordsAdapter.getInitialState({
  status: 'idle',
  currentRequestId: undefined,
  error: null,
});

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async (arg, { getState, requestId }) => {
    const { currentRequestId, status } = getState().records;
    if (status !== 'loading' || requestId !== currentRequestId) {
      return undefined;
    }
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(`${baseUrl}/api/partnerships/v0/records/`);
    return camelCaseObject(response.data.results);
  },
);

/* eslint-disable no-param-reassign */
const recordsSlice = createSlice({
  name: 'records',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchRecords.pending, (state, action) => {
        if (state.status === 'idle') {
          state.status = 'loading';
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (state.status === 'loading' && state.currentRequestId === requestId) {
          state.status = 'success';
          recordsAdapter.upsertMany(state, action.payload);
        }
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.status === 'loading' && state.currentRequestId === requestId) {
          state.status = 'failed';
          state.error = action.error.message;
        }
      });
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllRecords,
  selectById: selectRecordById,
  selectIds: selectRecordIds,
} = recordsAdapter.getSelectors(state => state.records);

export default recordsSlice.reducer;
