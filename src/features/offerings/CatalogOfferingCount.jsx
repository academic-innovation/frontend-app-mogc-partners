import React from 'react';
import PropTypes from 'prop-types';
import useOfferings from './useOfferings';

export default function CatalogOfferingCount({ catalog }) {
  const [offerings] = useOfferings();
  const count = offerings.filter(offering => offering.catalog === catalog).length;
  return <span>{count} course offering{count === 1 ? '' : 's'}.</span>;
}

CatalogOfferingCount.propTypes = {
  catalog: PropTypes.string.isRequired,
};
