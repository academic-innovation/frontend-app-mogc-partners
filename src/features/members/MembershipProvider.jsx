import React from 'react';
import PropTypes from 'prop-types';

import EntityContext from '../../common/EntityContext';
import useMembers from './useMembers';

export default function MembershipProvider({ children }) {
  const [entities, status] = useMembers();
  const contextValue = { entities, status }; // TODO: useMemo?
  return (
    <EntityContext.Provider value={contextValue}>{children}</EntityContext.Provider>
  );
}

MembershipProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
