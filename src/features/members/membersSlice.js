import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import {
  ensureConfig, getConfig, camelCaseObject, snakeCaseObject,
} from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Catalog API services');

const membersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.email.localeCompare(b.email),
});

const initialState = membersAdapter.getInitialState({
  status: 'idle',
  currentRequestId: undefined,
  error: null,
});

export const fetchMembers = createAsyncThunk(
  'members/fetchMembers',
  async (arg, { getState, requestId }) => {
    const { currentRequestId, status } = getState().members;
    if (status !== 'loading' || requestId !== currentRequestId) {
      return undefined;
    }
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(`${baseUrl}/api/partnerships/v0/memberships/`);
    return camelCaseObject(response.data.results);
  },
);

export const addMember = createAsyncThunk(
  'members/addMember',
  async ({ cohort, email }) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.post(
      `${baseUrl}/api/partnerships/v0/memberships/${cohort}/`,
      { email },
    );
    return camelCaseObject(response.data);
  },
);

export const importMembers = createAsyncThunk(
  'members/importMembers',
  async ({ cohort, emailList }) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.post(
      `${baseUrl}/api/partnerships/v0/memberships/${cohort}/`,
      snakeCaseObject(emailList.map(email => ({ email }))),
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
      .addCase(fetchMembers.pending, (state, action) => {
        if (state.status === 'idle') {
          state.status = 'loading';
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.status === 'loading'
          && state.currentRequestId === requestId
        ) {
          state.status = 'success';
          membersAdapter.upsertMany(state, action.payload);
        }
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.status === 'loading'
          && state.currentRequestId === requestId
        ) {
          state.status = 'failed';
          state.error = action.error.message;
        }
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
