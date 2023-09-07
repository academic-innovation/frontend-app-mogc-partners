import React from 'react';
import PropTypes from 'prop-types';
import useOfferings from './useOfferings';

export default function CatalogOfferingCount({ cohort }) {
  const [offerings] = useOfferings();
  const count = offerings.filter(offering => offering.cohort === cohort).length;
  return <span>{count} course offering{count === 1 ? '' : 's'}.</span>;
}

CatalogOfferingCount.propTypes = {
  cohort: PropTypes.string.isRequired,
};
