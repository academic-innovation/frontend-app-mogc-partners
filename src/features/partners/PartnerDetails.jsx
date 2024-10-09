import React from 'react';
import { Container } from '@openedx/paragon';

import usePartner from './usePartner';

import PartnerHeader from './PartnerHeader/PartnerHeader';
import PartnerOfferingList from '../offerings/PartnerOfferingList';
import EnrolledOfferingList from '../offerings/EnrolledOfferingList';

export default function PartnerDetails() {
  const [partner] = usePartner();

  if (!partner) {
    return null;
  }

  return (
    <>
      <PartnerHeader selectedView="partnerDetails" activeLabel={partner?.name} />

      <section className="p-3 pt-5">
        <Container size="lg">
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
