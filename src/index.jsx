import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, getConfig,
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

import { RouteProvider } from './common/RouteContext';

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
        <RouteProvider>
          <Routes>
            <Route exact path="/" Component={PartnerList} />
            <Route exact path="/:partnerSlug" Component={PartnerRedirect} />
            <Route exact path="/:partnerSlug/details" Component={PartnerDetails} />
            <Route exact path="/:partnerSlug/admin" Component={PartnerAdmin} />
            <Route exact path="/:partnerSlug/admin/insights" Component={PartnerStats} />
            <Route
              exact
              path="/:partnerSlug/admin/catalog/:cohortUuid"
              Component={CohortDetails}
            />
          </Routes>
        </RouteProvider>
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
});
