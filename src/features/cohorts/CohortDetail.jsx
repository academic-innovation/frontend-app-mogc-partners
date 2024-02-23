import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  Button, Container, useToggle, Spinner,
} from '@edx/paragon';

import { selectCohortById } from './cohortsSlice';
import useCohorts from './useCohorts';
import usePartner from '../partners/usePartner';
import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import OfferingList from '../offerings/OfferingList';
import MemberList from '../members/MemberList';
import AddMemberModal from '../members/AddMemberModal';
import ImportMembersModal from '../members/ImportMembersModal';
import AddOfferingModal from '../offerings/AddOfferingModal';
import ManagementToolbar from '../partners/ManagementToolbar';
import PartnerHeading from '../partners/PartnerHeading';

export default function CohortDetails() {
  const { cohortUuid } = useParams();
  const [partner, partnerSlug, partnersStatus] = usePartner();
  const [, cohortStatus] = useCohorts();
  const [isAddCourseOpen, openAddCourse, closeAddCourse] = useToggle(false);
  const [isAddMemberOpen, openAddMember, closeAddMember] = useToggle(false);
  const [isImportMembersOpen, openImportMembers, closeImportMembers] = useToggle(false);
  const cohort = useSelector(state => selectCohortById(state, cohortUuid));

  if (cohortStatus !== 'success' || partnersStatus !== 'fulfilled') {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }

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
          <div className="d-flex flex-row justify-content-between">
            <h2>Courses</h2>
            <div>
              <Button onClick={openAddCourse} className="ml-3">Add course</Button>
            </div>
          </div>

          <OfferingList cohort={cohort.uuid} admin />
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
          <div className="d-flex flex-row justify-content-between">
            <h2>Learners</h2>
            <div>
              <Button onClick={openAddMember} className="ml-3">Add learner</Button>
              <Button onClick={openImportMembers} className="ml-3">Import learners</Button>
            </div>
          </div>
          <MemberList cohort={cohort.uuid} />
        </Container>
      </section>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={closeAddMember}
        cohort={cohort.uuid}
      />

      <ImportMembersModal
        isOpen={isImportMembersOpen}
        onClose={closeImportMembers}
        cohort={cohort.uuid}
      />
    </>
  );
}
