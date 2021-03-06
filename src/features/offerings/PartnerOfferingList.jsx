import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { CardGrid, Spinner } from '@edx/paragon';

import uniqBy from 'lodash.uniqby';

import PartnerName from '../partners/PartnerName';
import { fetchOfferings, selectAllOfferings } from './offeringsSlice';
import OfferingCard from './OfferingCard';

export default function PartnerOfferingList({ partnerSlug }) {
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
    offering => offering.partner === partnerSlug && !offering.isEnrolled,
  );

  if (!partnerOfferings.length) {
    return (
      <p>
        <PartnerName slug={partnerSlug} /> {' '}
        is not yet offering any courses.
      </p>
    );
  }

  const offeringCards = partnerOfferings.map(
    offering => <OfferingCard offeringId={offering.id} />,
  );

  return <CardGrid>{offeringCards}</CardGrid>;
}

PartnerOfferingList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
