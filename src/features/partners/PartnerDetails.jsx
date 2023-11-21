import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Stack } from '@edx/paragon';

import { fetchPartners, selectPartnerById } from './partnersSlice';
import ManagementMenu from './ManagementMenu';

import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import PartnerOfferingList from '../offerings/PartnerOfferingList';
import EnrolledOfferingList from '../offerings/EnrolledOfferingList';
import ManagementToolbar from './ManagementToolbar';

export default function PartnerDetails() {
  const dispatch = useDispatch();
  const { partnerSlug } = useParams();
  const partnersStatus = useSelector((state) => state.partners.status);
  const partner = useSelector((state) => selectPartnerById(state, partnerSlug));

  useEffect(() => {
    if (partnersStatus === 'idle') {
      dispatch(fetchPartners());
    }
  }, [partnersStatus, dispatch]);

  return (
    <>
      <section className="px-3 py-5 bg-primary">
        <Container size="lg">
          <Stack direction="horizontal" gap={3} className="justify-content-between">
            <h1 className="text-white">{partner?.name}</h1>
            {
              partner?.isManager
                ? <ManagementMenu partner={partnerSlug} />
                : null
            }
          </Stack>
        </Container>
      </section>

      <section className="p-3 pt-5">
        <Container size="lg">
          <ManagementToolbar partner={partnerSlug} />
          <ResponsiveBreadcrumb
            links={[
              { label: 'Partners', url: '' },
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
