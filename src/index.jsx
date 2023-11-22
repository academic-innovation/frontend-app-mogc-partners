import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import ReactDOM from 'react-dom';

import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import { Route, Switch } from 'react-router';

import store from './common/store';
import appMessages from './i18n';
import PartnerList from './features/partners/PartnerList';
import PartnerAdmin from './features/partners/PartnerAdmin';
import PartnerDetails from './features/partners/PartnerDetails';
import PartnerStats from './features/partners/PartnerStats';
import CohortDetails from './features/cohorts/CohortDetail';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={store}>
      <Header />
      <main id="main">
        <Switch>
          <Route exact path="/" component={PartnerList} />
          <Route exact path="/:partnerSlug" component={PartnerDetails} />
          <Route exact path="/:partnerSlug/admin" component={PartnerAdmin} />
          <Route exact path="/:partnerSlug/admin/insights" component={PartnerStats} />
          <Route
            exact
            path="/:partnerSlug/admin/catalog/:cohortUuid"
            component={CohortDetails}
          />
        </Switch>
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
