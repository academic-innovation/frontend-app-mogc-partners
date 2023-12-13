import React from 'react';
import { Redirect } from 'react-router-dom';

import usePartner from './usePartner';

export default function PartnerRedirect() {
  const [partner, partnerSlug] = usePartner();

  if (!partner) {
    return null;
  }

  return partner.isManager
    ? <Redirect to={`${partnerSlug}/admin`} />
    : <Redirect to={`${partnerSlug}/details`} />;
}
