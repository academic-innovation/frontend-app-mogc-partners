import React from 'react';
import { Container } from '@edx/paragon';

import usePartner from './usePartner';

import ManagementMenu from './ManagementMenu';
import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import PartnerOfferingList from '../offerings/PartnerOfferingList';
import EnrolledOfferingList from '../offerings/EnrolledOfferingList';
import PartnerHeading from './PartnerHeading';

export default function PartnerDetails() {
  const [partner, partnerSlug] = usePartner();

  return (
    <>
      <PartnerHeading partnerName={partner?.name}>
        {
          partner?.isManager && <ManagementMenu partner={partnerSlug} />
        }
      </PartnerHeading>

      {partner && (
        <section className="p-3 pt-5">
          <Container size="lg">
            <ResponsiveBreadcrumb
              links={[
                { label: 'Partners', url: '' },
              ]}
              activeLabel={partner?.name}
            />
            <EnrolledOfferingList partnerSlug={partner.slug} />
          </Container>
        </section>
      )}

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
