import React from 'react';
import PropTypes from 'prop-types';

import { CardGrid, Spinner } from '@edx/paragon';

import PartnerName from '../partners/PartnerName';
import OfferingCard from './OfferingCard';
import useOfferings from './useOfferings';

export default function PartnerOfferingList({ partnerSlug }) {
  const [partnerOfferings, offeringsStatus] = useOfferings({ partnerSlug });

  if (offeringsStatus === 'loading') {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }

  const availableOfferings = partnerOfferings.filter(
    offering => !offering.isEnrolled,
  );

  const Header = () => <h2>Available Courses</h2>;
  if (!partnerOfferings.length) {
    return (
      <>
        <Header />
        <p>
          <PartnerName slug={partnerSlug} /> {' is not yet offering any courses.'}
        </p>
      </>
    );
  }
  if (!availableOfferings.length) {
    return null;
  }

  const offeringCards = availableOfferings.map(
    offering => <OfferingCard offeringId={offering.id} key={offering.id} />,
  );
  return (
    <>
      <Header />
      <CardGrid>{offeringCards}</CardGrid>
    </>
  );
}

PartnerOfferingList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
