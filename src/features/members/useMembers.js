import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, selectAllMembers, selectMembersByCohort } from './membersSlice';

export default function useMembers(options = { cohort: null }) {
  const { cohort } = options;

  const dispatch = useDispatch();

  let members = [];
  if (cohort) {
    members = useSelector(state => selectMembersByCohort(state, cohort));
  } else {
    members = useSelector(selectAllMembers);
  }

  const status = useSelector(state => state.members.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMembers());
    }
  }, [status, dispatch]);

  return [members, status];
}
