import {
  createSlice, createAsyncThunk, createEntityAdapter, createSelector,
} from '@reduxjs/toolkit';
import {
  camelCaseObject, snakeCaseObject,
} from '@edx/frontend-platform';
import normalizeSliceData from '../../utils/normalize';
import { setupRequest } from '../../utils/requests';

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
    const { client, baseUrl } = setupRequest();
    const response = await client.get(`${baseUrl}/api/partnerships/v0/memberships/`);
    return camelCaseObject(response.data.results);
  },
);

export const addMember = createAsyncThunk(
  'members/addMember',
  async ({ cohort, email }) => {
    const { client, baseUrl } = setupRequest();
    const response = await client.post(
      `${baseUrl}/api/partnerships/v0/memberships/${cohort}/`,
      { email },
    );
    return camelCaseObject(response.data);
  },
);

export const updateMember = createAsyncThunk(
  'members/updateMember',
  async ({ cohort, membershipId, payload }) => {
    const { client, baseUrl } = setupRequest();
    const response = await client.patch(
      `${baseUrl}/api/partnerships/v0/memberships/${cohort}/${membershipId}/`,
      payload,
    );
    return camelCaseObject(response.data);
  },
);

export const importMembers = createAsyncThunk(
  'members/importMembers',
  async (args) => {
    const { cohort, emailList } = args;
    const { client, baseUrl } = setupRequest();
    const { data } = await client.post(
      `${baseUrl}/api/partnerships/v0/memberships/${cohort}/`,
      snakeCaseObject(emailList.map(email => ({ email }))),
    );
    const normalized = normalizeSliceData(camelCaseObject(data), 'members');
    return normalized.entities;
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
      .addCase(addMember.fulfilled, membersAdapter.setOne)
      .addCase(updateMember.fulfilled, membersAdapter.setOne)
      .addCase(importMembers.pending, (state, action) => {
        state.status = 'loading';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(importMembers.fulfilled, (state, action) => {
        state.status = 'success';
        membersAdapter.upsertMany(state, action.payload.members);
      })
      .addCase(importMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllMembers,
  selectById: selectMemberById,
  selectIds: selectMemberIds,
} = membersAdapter.getSelectors(state => state.members);

export const selectMembersByCohort = createSelector(
  [
    selectAllMembers,
    (_, cohort) => cohort,
  ],
  (members, cohort) => members.filter(member => member.cohort === cohort),
);

export default membersSlice.reducer;
