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
    offering => offering.partner === partnerSlug,
  );
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
