import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  Button, Container, Stack, useToggle,
} from '@edx/paragon';

import { selectCatalogById } from './catalogsSlice';
import { selectPartnerById } from '../partners/partnersSlice';
import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import OfferingList from '../offerings/OfferingList';
import MemberList from '../members/MemberList';
import AddMemberModal from '../members/AddMemberModal';
import AddOfferingModal from '../offerings/AddOfferingModal';

export default function CatalogDetails() {
  const { partnerSlug, catalogUuid } = useParams();
  const [isAddCourseOpen, openAddCourse, closeAddCourse] = useToggle(false);
  const [isAddMemberOpen, openAddMember, closeAddMember] = useToggle(false);
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
          <ResponsiveBreadcrumb
            links={[
              { label: 'Partners', url: '' },
              { label: partner?.name, url: `/${partnerSlug}` },
              { label: 'Catalogs', url: `/${partnerSlug}/admin` },
            ]}
            activeLabel={catalog.name}
          />
          <h1>{catalog.name}</h1>
        </Container>
      </section>

      <section className="p-3">
        <Container size="lg">
          <h2>Courses</h2>
          <OfferingList cohort={catalog.uuid} admin />

          <Button onClick={openAddCourse}>Add course</Button>
        </Container>
      </section>

      <AddOfferingModal
        isOpen={isAddCourseOpen}
        onClose={closeAddCourse}
        catalog={catalog.uuid}
        partnerOfferings={partner.offerings}
      />

      <section className="p-3">
        <Container size="lg">
          <h2>Members</h2>

          <MemberList cohort={catalog.uuid} />

          <Button onClick={openAddMember} className="mt-3">Add member</Button>
        </Container>
      </section>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={closeAddMember}
        catalog={catalog.uuid}
      />
    </>
  );
}
