import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Button, Container, Stack } from '@edx/paragon';
import { selectCatalogById } from './catalogsSlice';
import { selectPartnerById } from '../partners/partnersSlice';
import OfferingList from '../offerings/OfferingList';
import AddOfferingForm from '../offerings/AddOfferingForm';
import MemberList from '../members/MemberList';
import AddMemberForm from '../members/AddMemberForm';

export default function CatalogDetails() {
  const { partnerSlug, catalogUuid } = useParams();
  const catalog = useSelector(state => selectCatalogById(state, catalogUuid));
  const partner = useSelector(state => selectPartnerById(state, catalog.partner));

  return (
    <>
      <section className="px-3 py-5 bg-primary">
        <Container size="lg">
          <Stack direction="horizontal" gap={3}>
            <h1 className="text-white">{partner?.name}</h1>
            <Button variant="inverse-outline-primary" href={`/${partnerSlug}`}>View</Button>
          </Stack>
        </Container>
      </section>

      <section className="p-3">
        <Container size="lg">
          <h1>{catalog.name}</h1>
        </Container>
      </section>

      <section className="p-3">
        <Container size="lg">
          <h2>Courses</h2>
          <OfferingList catalog={catalog.uuid} admin />

          <h2>Add a course</h2>
          <AddOfferingForm
            catalog={catalog.uuid}
            partnerOfferings={partner.offerings}
          />
        </Container>
      </section>

      <section className="p-3">
        <Container size="lg">
          <h2>Members</h2>

          <MemberList catalog={catalog.uuid} />

          <AddMemberForm catalog={catalog.uuid} />
        </Container>
      </section>
    </>
  );
}
