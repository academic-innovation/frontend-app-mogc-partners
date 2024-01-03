import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  Button, Container, useToggle,
} from '@edx/paragon';

import { selectCohortById } from './cohortsSlice';
import useCohorts from './useCohorts';
import usePartner from '../partners/usePartner';
import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import OfferingList from '../offerings/OfferingList';
import MemberList from '../members/MemberList';
import AddMemberModal from '../members/AddMemberModal';
import AddOfferingModal from '../offerings/AddOfferingModal';
import ManagementToolbar from '../partners/ManagementToolbar';
import PartnerHeading from '../partners/PartnerHeading';

export default function CohortDetails() {
  const { cohortUuid } = useParams();
  const [partner, partnerSlug] = usePartner();
  useCohorts();
  const [isAddCourseOpen, openAddCourse, closeAddCourse] = useToggle(false);
  const [isAddMemberOpen, openAddMember, closeAddMember] = useToggle(false);
  const cohort = useSelector(state => selectCohortById(state, cohortUuid));

  return (
    <>
      <PartnerHeading partnerName={partner?.name}>
        <Button variant="inverse-outline-primary" href={`/${partnerSlug}/details`}>View</Button>
      </PartnerHeading>

      <section className="p-3">
        <Container size="lg">
          <ManagementToolbar partner={partnerSlug} />
          <ResponsiveBreadcrumb
            links={[
              { label: 'Partners', url: '' },
              { label: partner?.name, url: `/${partnerSlug}` },
              { label: 'Cohorts', url: `/${partnerSlug}/admin` },
            ]}
            activeLabel={cohort.name}
          />
          <h1>{cohort.name}</h1>
        </Container>
      </section>

      <section className="p-3">
        <Container size="lg">
          <h2>Courses</h2>
          <OfferingList cohort={cohort.uuid} admin />

          <Button onClick={openAddCourse}>Add course</Button>
        </Container>
      </section>

      <AddOfferingModal
        isOpen={isAddCourseOpen}
        onClose={closeAddCourse}
        cohort={cohort.uuid}
        partnerOfferings={partner.offerings}
      />

      <section className="p-3">
        <Container size="lg">
          <h2>Members</h2>

          <MemberList cohort={cohort.uuid} />

          <Button onClick={openAddMember} className="mt-3">Add member</Button>
        </Container>
      </section>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={closeAddMember}
        cohort={cohort.uuid}
      />
    </>
  );
}
