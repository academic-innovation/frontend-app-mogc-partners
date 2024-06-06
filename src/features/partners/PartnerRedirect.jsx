import { Navigate } from 'react-router-dom';

import usePartner from './usePartner';

export default function PartnerRedirect() {
  const [partner, partnerSlug] = usePartner();

  if (!partner) {
    return null;
  }

  return partner.isManager
    ? <Navigate to={`/${partnerSlug}/admin`} />
    : <Navigate to={`/${partnerSlug}/details`} />;
}
