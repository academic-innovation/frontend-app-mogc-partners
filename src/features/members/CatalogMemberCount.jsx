import React from 'react';
import PropTypes from 'prop-types';
import useMembers from './useMembers';

export default function CatalogMemberCount({ cohort }) {
  const [members] = useMembers();
  const count = members.filter(member => member.cohort === cohort).length;
  return <span>{count} member{count === 1 ? '' : 's'}.</span>;
}

CatalogMemberCount.propTypes = {
  cohort: PropTypes.string.isRequired,
};
