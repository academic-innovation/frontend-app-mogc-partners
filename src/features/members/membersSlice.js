import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { ensureConfig, getConfig, camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Catalog API services');

const membersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.email.localeCompare(b.email),
});

const initialState = membersAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchMembers = createAsyncThunk(
  'members/fetchMembers',
  async () => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(`${baseUrl}/api/partnerships/v0/memberships/`);
    return camelCaseObject(response.data.results);
  },
);

export const addMember = createAsyncThunk(
  'members/addMember',
  async ({ catalog, email }) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.post(
      `${baseUrl}/api/partnerships/v0/memberships/${catalog}/`,
      { email },
    );
    return camelCaseObject(response.data);
  },
);

/* eslint-disable no-param-reassign */
const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = 'success';
        membersAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addMember.fulfilled, membersAdapter.addOne);
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllMembers,
  selectById: selectMemberById,
  selectIds: selectMemberIds,
} = membersAdapter.getSelectors(state => state.members);

export default membersSlice.reducer;
