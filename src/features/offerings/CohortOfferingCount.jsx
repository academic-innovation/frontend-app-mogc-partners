import React from 'react';
import PropTypes from 'prop-types';
import { selectAllOfferings } from './offeringsSlice';
import useOfferings from './useOfferings';

export default function CohortOfferingCount({ cohort }) {
  const [offerings] = useOfferings(selectAllOfferings);
  const count = offerings.filter(offering => offering.cohort === cohort).length;
  return <span>{count} course offering{count === 1 ? '' : 's'}.</span>;
}

CohortOfferingCount.propTypes = {
  cohort: PropTypes.string.isRequired,
};
