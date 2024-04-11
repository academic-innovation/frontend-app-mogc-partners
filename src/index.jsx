import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, getConfig, mergeConfig
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import ReactDOM from 'react-dom';

import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import { Route, Routes } from 'react-router';
import { Helmet } from 'react-helmet';

import store from './common/store';
import appMessages from './i18n';
import PartnerList from './features/partners/PartnerList';
import PartnerRedirect from './features/partners/PartnerRedirect';
import PartnerAdmin from './features/partners/PartnerAdmin';
import PartnerDetails from './features/partners/PartnerDetails';
import PartnerStats from './features/partners/PartnerStats';
import CohortDetails from './features/cohorts/CohortDetail';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={store}>
      <Helmet>
        <title>Partners | {getConfig().SITE_NAME}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" Component={PartnerList} />
          <Route path="/:partnerSlug" Component={PartnerRedirect} />
          <Route path="/:partnerSlug/details" Component={PartnerDetails} />
          <Route path="/:partnerSlug/admin" Component={PartnerAdmin} />
          <Route path="/:partnerSlug/admin/insights" Component={PartnerStats} />
          <Route
            exact
            path="/:partnerSlug/admin/catalog/:cohortUuid"
            Component={CohortDetails}
          />
        </Routes>
      </main>
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  requireAuthenticatedUser: true,
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  handlers: {
    config: () => {
      mergeConfig({
          SITE_NAME: "MOGC Partners",
          TERMS_OF_SERVICE_URL: `${getConfig().LMS_BASE_URL}/tos`,
          PRIVACY_POLICY_URL: `${getConfig().LMS_BASE_URL}/privacy`,
          SUPPORT_EMAIL: "fix@me.com",
          SUPPORT_URL: "https://teamdynamix.umich.edu/TDClient/187/Portal/Requests/TicketRequests/NewForm?ID=T0l23Fz2XA4_&RequestorType=Service",
          ENABLE_ACCESSIBILITY_PAGE: "https://teamdynamix.umich.edu/TDClient/187/Portal/KB/ArticleDet?ID=10934",
      })
    }
  }
});
