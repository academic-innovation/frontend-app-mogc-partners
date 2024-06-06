import React from 'react';
import PropTypes from 'prop-types';
import useCohorts from './useCohorts';
import CohortListItem from './CohortListItem';
import { selectCohortsByPartnerSlug } from './cohortsSlice';

export default function CohortList({ partnerSlug }) {
  const [cohorts] = useCohorts(state => selectCohortsByPartnerSlug(state, partnerSlug));

  return (
    <>
      {cohorts.map((cohort) => (
        <CohortListItem key={cohort.uuid} uuid={cohort.uuid} />
      ))}
    </>
  );
}

CohortList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
