import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';

import { Spinner, Stack } from '@edx/paragon';

import PartnerName from '../partners/PartnerName';
import EnrolledOfferingCard from './EnrolledOfferingCard';
import useOfferings from './useOfferings';

export default function EnrolledOfferingList({ partnerSlug }) {
  const [partnerOfferings, offeringsStatus] = useOfferings({
    partnerSlug,
    isEnrolled: true,
  });
  const uniqueOfferings = uniqBy(partnerOfferings, 'details.courseKey');

  if (offeringsStatus === 'loading') {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }

  const Header = () => <h2>Keep Learning</h2>;
  if (!uniqueOfferings.length) {
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

  const offeringCards = uniqueOfferings.map(
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
