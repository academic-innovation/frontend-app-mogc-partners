import React from 'react';
import { Container } from '@openedx/paragon';

import usePartner from './usePartner';

import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import PartnerOfferingList from '../offerings/PartnerOfferingList';
import EnrolledOfferingList from '../offerings/EnrolledOfferingList';
import ManagementToolbar from './ManagementToolbar';
import PartnerHeading from './PartnerHeading';

export default function PartnerDetails() {
  const [partner, partnerSlug] = usePartner();

  if (!partner) {
    return null;
  }

  return (
    <>
      <PartnerHeading partnerName={partner?.name} />

      <section className="p-3 pt-5">
        <Container size="lg">
          {partner?.isManager && <ManagementToolbar partner={partnerSlug} />}
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
