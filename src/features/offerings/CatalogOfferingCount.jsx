import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchOfferings, selectAllOfferings } from './offeringsSlice';

export default function CatalogOfferingCount({ catalog }) {
  const dispatch = useDispatch();
  const offerings = useSelector(selectAllOfferings);
  const offeringsStatus = useSelector(state => state.offerings.status);

  useEffect(() => {
    if (offeringsStatus === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [offeringsStatus, dispatch]);

  const count = offerings.filter(offering => offering.catalog === catalog).length;

  return <span>{count} course offering{count === 1 ? '' : 's'}.</span>;
}

CatalogOfferingCount.propTypes = {
  catalog: PropTypes.string.isRequired,
};
