import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOfferings,
  selectAllOfferings,
  selectOfferingsByPartnerSlug,
  selectEnrolledOfferingsByPartnerSlug,
} from './offeringsSlice';

export default function useOfferings(partnerSlug = null, isEnrolled = null) {
  const dispatch = useDispatch();

  let offerings = [];
  if (partnerSlug && !isEnrolled) {
    offerings = useSelector(
      (state) => selectOfferingsByPartnerSlug(state, partnerSlug, isEnrolled),
    );
  } else if (partnerSlug && isEnrolled) {
    offerings = useSelector(
      (state) => selectEnrolledOfferingsByPartnerSlug(state, partnerSlug),
    );
  } else {
    offerings = useSelector(selectAllOfferings);
  }

  const status = useSelector(state => state.offerings.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [status, dispatch]);
  return [offerings, status];
}
