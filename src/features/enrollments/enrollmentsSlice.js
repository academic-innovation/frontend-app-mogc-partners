import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { ensureConfig, getConfig, camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Partnership API services');

const enrollmentsAdapter = createEntityAdapter({
  selectId: enrollment => enrollment.courseDetails.courseId,
});

const initialState = enrollmentsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchEnrollments = createAsyncThunk(
  'enrollments/fetchEnrollments',
  async () => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(`${baseUrl}/api/enrollment/v1/enrollment`);
    return camelCaseObject(response.data);
  },
);

/* eslint-disable no-param-reassign */
const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchEnrollments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.status = 'success';
        enrollmentsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllEnrollments,
  selectById: selectEnrollmentById,
  selectIds: selectEnrollmentIds,
} = enrollmentsAdapter.getSelectors(state => state.enrollments);

export default enrollmentsSlice.reducer;
