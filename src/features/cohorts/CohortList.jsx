import React from 'react';
import PropTypes from 'prop-types';
import useCohorts from './useCohorts';
import CohortListItem from './CohortListItem';

export default function CohortList({ partnerSlug }) {
  const [cohorts] = useCohorts();

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
