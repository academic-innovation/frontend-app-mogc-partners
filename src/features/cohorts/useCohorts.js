import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCohorts, selectAllCohorts } from './cohortsSlice';

export default function useCohorts() {
  const dispatch = useDispatch();
  const cohorts = useSelector(selectAllCohorts);
  const status = useSelector(state => state.cohorts.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCohorts());
    }
  }, [status, dispatch]);
  return [cohorts, status];
};
