import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOfferings, selectAllOfferings } from './offeringsSlice';

export default function useOfferings() {
  const dispatch = useDispatch();
  const offerings = useSelector(selectAllOfferings);
  const status = useSelector(state => state.offerings.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [status, dispatch]);
  return [offerings, status];
}
