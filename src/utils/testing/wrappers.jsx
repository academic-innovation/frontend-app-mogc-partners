import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import store from '../../common/store';

/**
 * Wrapper for components that require i18n configuration (messages, locale,
 * time zone, etc.).
 *
 * If your component uses Paragon components that provide their own strings,
 * you will probably need this.
 */
export const IntlWrapper = ({ children }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

IntlWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Wrapper for components that require Redux functionality.
 */
export const ReduxWrapper = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

ReduxWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Wrapper for components that require both i18n and Redux.
 */
export const IntlReduxWrapper = ({ children }) => (
  <IntlWrapper>
    <ReduxWrapper>
      {children}
    </ReduxWrapper>
  </IntlWrapper>
);

IntlReduxWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
