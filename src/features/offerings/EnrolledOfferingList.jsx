import React from 'react';
import PropTypes from 'prop-types';

import { Spinner, Stack } from '@edx/paragon';

import uniqBy from 'lodash.uniqby';

import PartnerName from '../partners/PartnerName';
import EnrolledOfferingCard from './EnrolledOfferingCard';
import useOfferings from './useOfferings';

export default function EnrolledOfferingList({ partnerSlug }) {
  const [offerings, offeringsStatus] = useOfferings();
  const uniqOfferings = uniqBy(offerings, 'details.courseKey');

  if (offeringsStatus === 'loading') {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }

  const partnerOfferings = uniqOfferings.filter(
    offering => offering.partner === partnerSlug && offering.isEnrolled,
  );

  const Header = () => <h2>Keep Learning</h2>;
  if (!partnerOfferings.length) {
    return (
      <>
        <Header />
        <p>
          You are not currently enrolled in any {' '}
          <PartnerName slug={partnerSlug} /> offerings.
        </p>
      </>
    );
  }

  const offeringCards = partnerOfferings.map(
    offering => <EnrolledOfferingCard offeringId={offering.id} key={offering.id} />,
  );

  return (
    <>
      <Header />
      <Stack gap={3}>{offeringCards}</Stack>
    </>
  );
}

EnrolledOfferingList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
