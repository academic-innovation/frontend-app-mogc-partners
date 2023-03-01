import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecords, selectAllRecords } from './recordsSlice';

export default function useRecords() {
  const dispatch = useDispatch();
  const records = useSelector(selectAllRecords);
  const status = useSelector(state => state.records.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRecords());
    }
  }, [status, dispatch]);

  return [records, status];
}
