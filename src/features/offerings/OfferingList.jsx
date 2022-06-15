import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CardGrid } from '@edx/paragon';
import { fetchOfferings, selectAllOfferings } from './offeringsSlice';
import AdminOfferingCard from './AdminOfferingCard';

export default function OfferingList({ catalog }) {
  const dispatch = useDispatch();
  const offerings = useSelector(selectAllOfferings);
  const offeringsStatus = useSelector(state => state.offerings.status);

  useEffect(() => {
    if (offeringsStatus === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [offeringsStatus, dispatch]);

  const offeringCards = offerings.filter(offering => offering.catalog === catalog).map(
    offering => <AdminOfferingCard offeringId={offering.id} />,
  );

  return (
    <CardGrid>
      {offeringCards}
    </CardGrid>
  );
}

OfferingList.propTypes = {
  catalog: PropTypes.string.isRequired,
};
