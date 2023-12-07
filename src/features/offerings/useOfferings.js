import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOfferings, selectAllOfferings, selectOfferingsByPartnerSlug } from './offeringsSlice';

export default function useOfferings(partnerSlug = null, checkIsEnrolled = false) {
  const dispatch = useDispatch();
  const offerings = partnerSlug
    ? useSelector(
      (state) => selectOfferingsByPartnerSlug(state, partnerSlug, checkIsEnrolled),
    )
    : useSelector(selectAllOfferings);
  const status = useSelector(state => state.offerings.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [status, dispatch]);
  return [offerings, status];
}
