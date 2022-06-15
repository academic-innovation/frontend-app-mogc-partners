import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Stack } from '@edx/paragon';

import { fetchPartners, selectPartnerById } from './partnersSlice';

import PartnerOfferingList from '../offerings/PartnerOfferingList';
import EnrolledOfferingList from '../offerings/EnrolledOfferingList';

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
          <Stack direction="horizontal" gap={3}>
            <h1 className="text-white">{partner?.name}</h1>
            {
              partner?.isManager
                ? <Button variant="inverse-outline-primary" href={`/${partnerSlug}/admin`}>Manage</Button>
                : null
            }
          </Stack>
        </Container>
      </section>

      <section className="p-3 pt-5">
        <Container size="lg">
          <h2>Keep Learning</h2>
          <EnrolledOfferingList partnerSlug={partner?.slug} />
        </Container>
      </section>

      <section className="p-3 pb-5">
        <Container size="lg">
          <h2>Available Courses</h2>
          <PartnerOfferingList partnerSlug={partner?.slug} />
        </Container>
      </section>
    </>
  );
}
