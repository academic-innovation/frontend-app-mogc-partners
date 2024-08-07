import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {
  ensureConfig, getConfig, camelCaseObject, snakeCaseObject,
} from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Partnership API services');

const offeringsAdapter = createEntityAdapter({
  selectId: offering => offering.id,
});

const initialState = offeringsAdapter.getInitialState({
  status: 'idle',
  currentRequestId: undefined,
  error: null,
});

export async function enrollInCourse(courseId) {
  const client = getAuthenticatedHttpClient();
  const baseUrl = getConfig().LMS_BASE_URL;
  const enrollmentData = {
    courseDetails: { courseId },
  };
  const response = await client.post(`${baseUrl}/api/enrollment/v1/enrollment`, snakeCaseObject(enrollmentData));
  return camelCaseObject(response.data);
}

export const fetchOfferings = createAsyncThunk(
  'offerings/fetchOfferings',
  async (args, { getState, requestId }) => {
    const { currentRequestId, status } = getState().offerings;
    if (status !== 'loading' || requestId !== currentRequestId) {
      return undefined;
    }
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(`${baseUrl}/api/partnerships/v0/offerings/`);
    return camelCaseObject(response.data);
  },
);

export const addOffering = createAsyncThunk(
  'offerings/addOffering',
  async ({ cohort, offering }) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.post(
      `${baseUrl}/api/partnerships/v0/offerings/${cohort}/`,
      { offering },
    );
    return camelCaseObject(response.data);
  },
);

/* eslint-disable no-param-reassign */
const offeringsSlice = createSlice({
  name: 'offerings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOfferings.pending, (state, action) => {
        if (state.status === 'idle') {
          state.status = 'loading';
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchOfferings.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.status === 'loading'
          && state.currentRequestId === requestId
        ) {
          state.status = 'success';
          offeringsAdapter.upsertMany(state, action.payload);
        }
      })
      .addCase(fetchOfferings.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.status === 'loading'
          && state.currentRequestId === requestId
        ) {
          state.status = 'failed';
          state.error = action.error.message;
        }
      })
      .addCase(addOffering.fulfilled, offeringsAdapter.addOne);
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllOfferings,
  selectById: selectOfferingById,
  selectIds: selectOfferingIds,
} = offeringsAdapter.getSelectors(state => state.offerings);

const filterByEnrolled = (offerings) => offerings.filter(
  offering => offering.isEnrolled,
);
const filterBySlug = (offerings, partner) => offerings.filter(
  offering => offering.partner === partner,
);

export const selectOfferingsByPartnerSlug = createSelector(
  [selectAllOfferings, (state, partner) => partner],
  (offerings, partner) => filterBySlug(offerings, partner),
);

export const selectEnrolledOfferingsByPartnerSlug = createSelector(
  [selectOfferingsByPartnerSlug],
  filterByEnrolled,
);
export default offeringsSlice.reducer;
