import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, selectAllMembers } from './membersSlice';

export default function useMembers() {
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const status = useSelector(state => state.members.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMembers());
    }
  }, [status, dispatch]);

  return [members, status];
}
