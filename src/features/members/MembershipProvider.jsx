import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import EntityContext from '../../common/EntityContext';
import useMembers from './useMembers';
import { selectAllMembers } from './membersSlice';

export default function MembershipProvider({ children }) {
  const [entities, status] = useMembers(selectAllMembers);
  const contextValue = useMemo(() => ({ entities, status }), [entities, status]);
  return (
    <EntityContext.Provider value={contextValue}>{children}</EntityContext.Provider>
  );
}

MembershipProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
