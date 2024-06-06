import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCohorts } from './cohortsSlice';

export default function useCohorts(selector) {
  const dispatch = useDispatch();
  const cohorts = useSelector(selector);

  const status = useSelector(state => state.cohorts.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCohorts());
    }
  }, [status, dispatch]);
  return [cohorts, status];
}
