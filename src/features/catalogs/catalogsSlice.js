import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import {
  ensureConfig, getConfig, camelCaseObject, snakeCaseObject,
} from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Catalog API services');

const catalogsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b),
  selectId: catalog => catalog.uuid,
});

const initialState = catalogsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchCatalogs = createAsyncThunk('catalogs/fetchCatalogs', async () => {
  const client = getAuthenticatedHttpClient();
  const baseUrl = getConfig().LMS_BASE_URL;
  const response = await client.get(`${baseUrl}/api/partnerships/v0/catalogs/`);
  return camelCaseObject(response.data);
});

export const addCatalog = createAsyncThunk(
  'catalogs/addCatalog',
  async (initialCatalog) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.post(
      `${baseUrl}/api/partnerships/v0/catalogs/`, snakeCaseObject(initialCatalog),
    );
    return camelCaseObject(response.data);
  },
);

export const deleteCatalog = createAsyncThunk(
  'catalogs/deleteCatalog',
  async (catalogUuid) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    await client.delete(
      `${baseUrl}/api/partnerships/v0/catalogs/${catalogUuid}`,
    );
    return catalogUuid;
  },
);

export const updateCatalog = createAsyncThunk(
  'catalogs/updateCatalog',
  async ({ uuid, catalogUpdates }) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.put(
      `${baseUrl}/api/partnerships/v0/catalogs/${uuid}`,
      snakeCaseObject(catalogUpdates),
    );
    return response.data;
  },
);

/* eslint-disable no-param-reassign */
const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCatalogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatalogs.fulfilled, (state, action) => {
        state.status = 'success';
        catalogsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchCatalogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCatalog.fulfilled, catalogsAdapter.addOne)
      .addCase(updateCatalog.fulfilled, (state, action) => {
        const updatedCatalog = action.payload;
        catalogsAdapter.updateOne(state, {
          id: updatedCatalog.uuid,
          changes: { name: updatedCatalog.name },
        });
      })
      .addCase(deleteCatalog.fulfilled, (state, action) => {
        catalogsAdapter.removeOne(state, action.payload);
      });
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllCatalogs,
  selectById: selectCatalogById,
  selectIds: selectCatalogIds,
} = catalogsAdapter.getSelectors(state => state.catalogs);

export default catalogsSlice.reducer;
