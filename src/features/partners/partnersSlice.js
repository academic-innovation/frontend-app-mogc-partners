import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {
  ensureConfig,
  getConfig,
  camelCaseObject,
} from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Partnership API services');

const partnersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b),
  selectId: (partner) => partner.slug,
});

const initialState = partnersAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchPartners = createAsyncThunk(
  'partners/fetchPartners',
  async () => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(
      `${baseUrl}/api/partnerships/v0/partners/`,
    );
    return camelCaseObject(response.data);
  },
);

/* eslint-disable no-param-reassign */
const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    setCurrentPartner(state, action) {
      state.currentPartner = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.status = 'fufilled';
        partnersAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllPartners,
  selectById: selectPartnerById,
  selectIds: selectPartnerIds,
} = partnersAdapter.getSelectors((state) => state.partners);

export const { setCurrentPartner } = partnersSlice.actions;
export default partnersSlice.reducer;
