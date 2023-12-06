import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPartners, selectPartnerById } from './partnersSlice';

export default function PartnerRedirect() {
  const dispatch = useDispatch();
  const { partnerSlug } = useParams();
  const partnersStatus = useSelector((state) => state.partners.status);
  const partner = useSelector((state) => selectPartnerById(state, partnerSlug));

  useEffect(() => {
    if (partnersStatus === 'idle') {
    dispatch(fetchPartners());
    }
  }, [partnersStatus, dispatch]);

  if (!partner) {
    return null;
  }

  return partner.isManager
    ? <Redirect to={`${partnerSlug}/admin`} />
    : <Redirect to={`${partnerSlug}/details`} />;
}
