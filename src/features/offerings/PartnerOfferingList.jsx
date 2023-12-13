import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';

import { CardGrid, Spinner } from '@edx/paragon';

import PartnerName from '../partners/PartnerName';
import OfferingCard from './OfferingCard';
import useOfferings from './useOfferings';

export default function PartnerOfferingList({ partnerSlug }) {
  const [partnerOfferings, offeringsStatus] = useOfferings({ partnerSlug });
  const uniqueOfferings = uniqBy(partnerOfferings, 'details.courseKey');

  if (offeringsStatus === 'loading') {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }

  const availableOfferings = uniqueOfferings.filter(
    offering => !offering.isEnrolled,
  );

  const Header = () => <h2>Available Courses</h2>;
  if (!uniqueOfferings.length) {
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
