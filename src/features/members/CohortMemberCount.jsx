import React from 'react';
import PropTypes from 'prop-types';
import useMembers from './useMembers';
import { selectAllMembers } from './membersSlice';

export default function CohortMemberCount({ cohort }) {
  const [members] = useMembers(selectAllMembers);
  const count = members.filter(member => member.cohort === cohort).length;
  return <span>{count} member{count === 1 ? '' : 's'}.</span>;
}

CohortMemberCount.propTypes = {
  cohort: PropTypes.string.isRequired,
};
