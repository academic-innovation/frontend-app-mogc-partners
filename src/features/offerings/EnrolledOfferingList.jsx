import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';

import { Spinner, Stack } from '@openedx/paragon';

import PartnerName from '../partners/PartnerName';
import EnrolledOfferingCard from './EnrolledOfferingCard';
import useOfferings from './useOfferings';
import { selectOfferingsByPartnerSlug } from './offeringsSlice';

export default function EnrolledOfferingList({ partnerSlug }) {
  const isEnrolled = true;
  const [partnerOfferings, offeringsStatus] = useOfferings(
    (state) => selectOfferingsByPartnerSlug(state, partnerSlug, isEnrolled),
  );
  const uniqueOfferings = uniqBy(partnerOfferings, 'details.courseKey');

  if (offeringsStatus === 'loading') {
    return (
      <Spinner
        animation="border"
        className="mie-3"
        screenReaderText="loading"
      />
    );
  }

  if (!uniqueOfferings.length) {
    return (
      <>
        <h2>Keep Learning</h2>
        <p>
          You are not currently enrolled in any{' '}
          <PartnerName slug={partnerSlug} /> offerings.
        </p>
      </>
    );
  }

  const offeringCards = uniqueOfferings.map((offering) => (
    <EnrolledOfferingCard offeringId={offering.id} key={offering.id} />
  ));

  return (
    <>
      <h2>Keep Learning</h2>
      <Stack gap={3}>{offeringCards}</Stack>
    </>
  );
}

EnrolledOfferingList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
