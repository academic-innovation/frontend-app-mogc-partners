import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers } from './membersSlice';

export default function useMembers(selector) {
  const dispatch = useDispatch();
  const members = useSelector(selector);

  const status = useSelector(state => state.members.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMembers());
    }
  }, [status, dispatch]);

  return [members, status];
}
