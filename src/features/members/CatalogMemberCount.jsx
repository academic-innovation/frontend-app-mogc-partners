import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchMembers, selectAllMembers } from './membersSlice';

export default function CatalogMemberCount({ catalog }) {
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const membersStatus = useSelector(state => state.members.status);

  useEffect(() => {
    if (membersStatus === 'idle') {
      dispatch(fetchMembers());
    }
  }, [membersStatus, dispatch]);

  const count = members.filter(member => member.catalog === catalog).length;

  return <span>{count} member{count === 1 ? '' : 's'}.</span>;
}

CatalogMemberCount.propTypes = {
  catalog: PropTypes.string.isRequired,
};
