import React from 'react';
import PropTypes from 'prop-types';
import useMembers from './useMembers';

export default function CatalogMemberCount({ catalog }) {
  const [members] = useMembers();
  const count = members.filter(member => member.catalog === catalog).length;
  return <span>{count} member{count === 1 ? '' : 's'}.</span>;
}

CatalogMemberCount.propTypes = {
  catalog: PropTypes.string.isRequired,
};
