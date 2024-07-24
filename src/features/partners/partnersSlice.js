import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { camelCaseObject } from '@edx/frontend-platform';
import { setupRequest } from '../../utils/requests';

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
    const { client, baseUrl } = setupRequest();
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
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.status = 'fulfilled';
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

export default partnersSlice.reducer;
