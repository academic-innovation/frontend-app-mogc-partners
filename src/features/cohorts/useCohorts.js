import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCohorts, selectAllCohorts, selectCohortsByPartnerSlug } from './cohortsSlice';

export default function useCohorts(options = { partnerSlug: null }) {
  const { partnerSlug } = options;

  const dispatch = useDispatch();

  let cohorts = [];
  if (partnerSlug) {
    cohorts = useSelector(state => selectCohortsByPartnerSlug(state, partnerSlug));
  } else {
    cohorts = useSelector(selectAllCohorts);
  }

  const status = useSelector(state => state.cohorts.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCohorts());
    }
  }, [status, dispatch]);
  return [cohorts, status];
}
