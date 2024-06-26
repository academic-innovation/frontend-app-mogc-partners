import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  ensureConfig,
  getConfig,
} from '@edx/frontend-platform';

ensureConfig(['LMS_BASE_URL'], 'Partnership API services');

/* eslint-disable-next-line */
export const setupRequest = () => {
  const baseUrl = getConfig().LMS_BASE_URL;
  const client = getAuthenticatedHttpClient();
  return { client, baseUrl };
};
