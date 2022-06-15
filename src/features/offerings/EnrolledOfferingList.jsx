import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Spinner, Stack } from '@edx/paragon';

import uniqBy from 'lodash.uniqby';

import PartnerName from '../partners/PartnerName';
import { fetchOfferings, selectAllOfferings } from './offeringsSlice';
import EnrolledOfferingCard from './EnrolledOfferingCard';

export default function EnrolledOfferingList({ partnerSlug }) {
  const dispatch = useDispatch();
  const offerings = useSelector(selectAllOfferings);
  const offeringsStatus = useSelector(state => state.offerings.status);
  const uniqOfferings = uniqBy(offerings, 'details.courseKey');

  useEffect(() => {
    if (offeringsStatus === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [offeringsStatus, dispatch]);

  if (offeringsStatus === 'loading') {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }

  const partnerOfferings = uniqOfferings.filter(
    offering => offering.partner === partnerSlug && offering.isEnrolled,
  );

  if (!partnerOfferings.length) {
    return (
      <p>
        You are not currently enrolled in any {' '}
        <PartnerName slug={partnerSlug} /> offerings.
      </p>
    );
  }

  const offeringCards = partnerOfferings.map(
    offering => <EnrolledOfferingCard offeringId={offering.id} />,
  );

  return <Stack gap={3}>{offeringCards}</Stack>;
}

EnrolledOfferingList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
