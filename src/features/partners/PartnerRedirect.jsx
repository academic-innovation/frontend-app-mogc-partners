import { Navigate } from 'react-router-dom';

import { useRouteContext } from '../../common/RouteContext';

import usePartner from './usePartner';

export default function PartnerRedirect() {
  const { sharedState } = useRouteContext();
  const { isPreview } = sharedState;

  const [partner, partnerSlug] = usePartner();

  if (!partner) {
    return null;
  }

  return (partner.isManager && !isPreview)
    ? <Navigate to={`/${partnerSlug}/admin`} />
    : <Navigate to={`/${partnerSlug}/details`} />;
}
