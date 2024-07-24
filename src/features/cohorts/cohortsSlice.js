import {
  createSlice, createAsyncThunk, createEntityAdapter, createSelector,
} from '@reduxjs/toolkit';
import {
  camelCaseObject, snakeCaseObject,
} from '@edx/frontend-platform';
import { setupRequest } from '../../utils/requests';

const cohortsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b),
  selectId: cohort => cohort.uuid,
});

const initialState = cohortsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchCohorts = createAsyncThunk('cohorts/fetchCohorts', async () => {
  const { client, baseUrl } = setupRequest();
  const response = await client.get(`${baseUrl}/api/partnerships/v0/cohorts/`);
  return camelCaseObject(response.data);
});

export const addCohort = createAsyncThunk(
  'cohorts/addCohort',
  async (initialCohort) => {
    const { client, baseUrl } = setupRequest();
    const response = await client.post(`${baseUrl}/api/partnerships/v0/cohorts/`, snakeCaseObject(initialCohort));
    return camelCaseObject(response.data);
  },
);

export const deleteCohort = createAsyncThunk(
  'cohorts/deleteCohort',
  async (cohortUuid) => {
    const { client, baseUrl } = setupRequest();
    await client.delete(
      `${baseUrl}/api/partnerships/v0/cohorts/${cohortUuid}`,
    );
    return cohortUuid;
  },
);

export const updateCohort = createAsyncThunk(
  'cohorts/updateCohort',
  async ({ uuid, cohortUpdates }) => {
    const { client, baseUrl } = setupRequest();
    const response = await client.put(
      `${baseUrl}/api/partnerships/v0/cohorts/${uuid}`,
      snakeCaseObject(cohortUpdates),
    );
    return response.data;
  },
);

/* eslint-disable no-param-reassign */
const cohortsSlice = createSlice({
  name: 'cohorts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCohorts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCohorts.fulfilled, (state, action) => {
        state.status = 'success';
        cohortsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchCohorts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCohort.fulfilled, cohortsAdapter.addOne)
      .addCase(updateCohort.fulfilled, (state, action) => {
        const updatedCohort = action.payload;
        cohortsAdapter.updateOne(state, {
          id: updatedCohort.uuid,
          changes: { name: updatedCohort.name },
        });
      })
      .addCase(deleteCohort.fulfilled, (state, action) => {
        cohortsAdapter.removeOne(state, action.payload);
      });
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllCohorts,
  selectById: selectCohortById,
  selectIds: selectCohortIds,
} = cohortsAdapter.getSelectors(state => state.cohorts);

export const selectCohortsByPartnerSlug = createSelector(
  [
    selectAllCohorts,
    (_, partner) => partner,
  ],
  (cohorts, partner) => cohorts.filter(cohort => cohort.partner === partner),
);

export default cohortsSlice.reducer;
