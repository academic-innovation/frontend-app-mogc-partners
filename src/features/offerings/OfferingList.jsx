import React from 'react';
import PropTypes from 'prop-types';
import { CardGrid } from '@openedx/paragon';
import AdminOfferingCard from './AdminOfferingCard';
import { selectAllOfferings } from './offeringsSlice';
import useOfferings from './useOfferings';

export default function OfferingList({ cohort }) {
  const [offerings] = useOfferings(selectAllOfferings);
  const offeringCards = offerings.filter(offering => offering.cohort === cohort).map(
    offering => <AdminOfferingCard key={offering.id} offeringId={offering.id} />,
  );

  if (!offeringCards.length) {
    return <p>No courses have been added to this cohort.</p>;
  }

  return (
    <section className="mt-3">
      <CardGrid>
        {offeringCards}
      </CardGrid>
    </section>
  );
}

OfferingList.propTypes = {
  cohort: PropTypes.string.isRequired,
};
