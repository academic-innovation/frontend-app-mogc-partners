import React, {
  createContext, useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';

const RouteContext = createContext();

export function useRouteContext() {
  return useContext(RouteContext);
}

const initialState = {
  // Determines if partner manager is in Learner Preview
  isPreview: false,
};

export function RouteProvider({ children }) {
  const [sharedState, setSharedState] = useState(initialState);

  const value = useMemo(() => ({ sharedState, setSharedState }), [sharedState]);

  return (
    <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
  );
}

RouteProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
