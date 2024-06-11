import React from 'react';
import { Container } from '@openedx/paragon';

import usePartner from './usePartner';

import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import PartnerOfferingList from '../offerings/PartnerOfferingList';
import EnrolledOfferingList from '../offerings/EnrolledOfferingList';
import ManagementToolbar from './ManagementToolbar';
import PartnerHeading from './PartnerHeading';
import AlertBanner from '../../common/AlertBanner';

import { useRouteContext } from '../../common/RouteContext';

export default function PartnerDetails() {
  const { sharedState, setSharedState } = useRouteContext();
  const { isPreview } = sharedState;

  const togglePreview = () => setSharedState({ isPreview: !sharedState.isPreview });

  const [partner, partnerSlug] = usePartner();

  if (!partner) {
    return null;
  }

  return (
    <>
      {isPreview && (
        <AlertBanner
          variant="accentB"
          dismissible
          onDismiss={togglePreview}
        >
          You are viewing this page as a learner.
        </AlertBanner>
      )}
      <PartnerHeading partnerName={partner?.name} />

      <section className="p-3 pt-5">
        <Container size="lg">
          {(partner?.isManager && !isPreview) && (
            <ManagementToolbar partner={partnerSlug} />
          )}
          <ResponsiveBreadcrumb
            links={[
              { label: 'Partners', url: '/' },
            ]}
            activeLabel={partner?.name}
          />
          <EnrolledOfferingList partnerSlug={partner?.slug} />
        </Container>
      </section>

      {partner && (
        <section className="p-3 pb-5">
          <Container size="lg">
            <PartnerOfferingList partnerSlug={partner.slug} />
          </Container>
        </section>
      )}
    </>
  );
}
