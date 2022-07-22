import React from 'react';
import PropTypes from 'prop-types';
import { CardGrid } from '@edx/paragon';
import AdminOfferingCard from './AdminOfferingCard';
import useOfferings from './useOfferings';

export default function OfferingList({ catalog }) {
  const [offerings] = useOfferings();
  const offeringCards = offerings.filter(offering => offering.catalog === catalog).map(
    offering => <AdminOfferingCard key={offering.id} offeringId={offering.id} />,
  );

  if (!offeringCards.length) {
    return <p>No courses have been added to this catalog.</p>;
  }

  return (
    <CardGrid>
      {offeringCards}
    </CardGrid>
  );
}

OfferingList.propTypes = {
  catalog: PropTypes.string.isRequired,
};
