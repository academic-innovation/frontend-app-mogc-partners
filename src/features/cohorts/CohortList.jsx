import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCohorts, selectAllCohorts } from './cohortsSlice';
import CohortListItem from './CohortListItem';

export default function CohortList({ partnerSlug }) {
  const dispatch = useDispatch();
  const cohorts = useSelector(selectAllCohorts);
  const cohortsStatus = useSelector(state => state.cohorts.status);

  useEffect(() => {
    if (cohortsStatus === 'idle') {
      dispatch(fetchCohorts());
    }
  }, [cohortsStatus, dispatch]);

  const cohortItems = cohorts
    .filter(cohort => cohort.partner === partnerSlug)
    .map(cohort => (
      <CohortListItem key={cohort.uuid} uuid={cohort.uuid} />
    ));

  return (
    <>
      {cohortItems}
    </>
  );
}

CohortList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
