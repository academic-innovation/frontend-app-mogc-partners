import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOfferings } from './offeringsSlice';

export default function useOfferings(selector) {
  const dispatch = useDispatch();
  const offerings = useSelector(selector);

  const status = useSelector((state) => state.offerings.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [status, dispatch]);
  return [offerings, status];
}
