import React from 'react';
import { Container, Stack } from '@openedx/paragon';
import uniqBy from 'lodash.uniqby';

import MemberStatsCard from '../members/MemberStatCard';
import EnrollmentStatsCard from '../enrollments/EnrollmentStatCard';
import CourseEnrollmentList from '../enrollments/CourseEnrollmentList';
import MemberEnrollmentList from '../enrollments/MemberEnrollmentList';
import MembershipProvider from '../members/MembershipProvider';
import useCohorts from '../cohorts/useCohorts';
import usePartner from './usePartner';
import useOfferings from '../offerings/useOfferings';
import StatCard from './StatCard';
import ManagementToolbar from './ManagementToolbar';
import PartnerHeading from './PartnerHeading';
import { selectCohortsByPartnerSlug } from '../cohorts/cohortsSlice';
import { selectEnrolledOfferingsByPartnerSlug } from '../offerings/offeringsSlice';

export default function PartnerStats() {
  const [partner, partnerSlug] = usePartner();
  const [partnerOfferings] = useOfferings(
    state => selectEnrolledOfferingsByPartnerSlug(state, partnerSlug),
  );
  const [partnerCohorts] = useCohorts(
    state => selectCohortsByPartnerSlug(state, partnerSlug),
  );

  const uniqueOfferings = uniqBy(partnerOfferings, 'details.courseKey');
  const courseCount = uniqueOfferings?.length || 0;
  const courseUnit = courseCount === 1 ? 'Course' : 'Courses';

  if (!partner) {
    return null;
  }

  return (
    <>
      <PartnerHeading partnerName={partner?.name} />

      <section className="p-3 py-5 bg-gray-100">
        <Container size="lg">
          <ManagementToolbar partner={partnerSlug} selected={false} />
          <h2 className="text-center mb-5">Organizational Totals</h2>
          <Stack direction="horizontal" gap={3}>
            <StatCard value={courseCount} unit="Total" secondary={courseUnit} />
            <MemberStatsCard partner={partnerSlug} />
            <EnrollmentStatsCard partner={partnerSlug} />
            <EnrollmentStatsCard partner={partnerSlug} onlyComplete />
          </Stack>
        </Container>
      </section>

      <section className="p-3 py-5">
        <Container size="lg">
          <h2>Course Details</h2>
          <CourseEnrollmentList
            offerings={partnerOfferings ?? []}
            cohorts={partnerCohorts}
          />
        </Container>
      </section>

      <section className="p-3 py-5">
        <Container size="lg">
          <h2>User Details</h2>
          <MembershipProvider>
            <MemberEnrollmentList
              offerings={partnerOfferings ?? []}
              cohorts={partnerCohorts}
            />
          </MembershipProvider>
        </Container>
      </section>
    </>
  );
}
