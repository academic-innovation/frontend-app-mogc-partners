import React from 'react';
import { Container, Stack } from '@edx/paragon';

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
import ManagementMenu from './ManagementMenu';

export default function PartnerStats() {
  const [partner, partnerSlug] = usePartner();
  const [offerings, offeringStatus] = useOfferings();
  const [cohorts] = useCohorts();

  const uniqOfferings = uniqBy(offerings, 'details.courseKey');
  const partnerOfferings = offeringStatus === 'success'
    ? uniqOfferings.filter(
        offering => offering.partner === partnerSlug
      )
    : [];

  const courseCount = partnerOfferings.length;
  const courseUnit = courseCount === 1 ? 'Course' : 'Courses';

  return (
    <>
      <section className="px-3 py-5 bg-primary">
        <Container size="lg">
          <Stack direction="horizontal" gap={3} className="justify-content-between">
            <h1 className="text-white">{partner?.name}</h1>
            <ManagementMenu partner={partnerSlug} />
          </Stack>
        </Container>
      </section>

      <section className="p-3 py-5 bg-gray-100">
        <Container size="lg">
          <h2 className="text-center mb-5">Organizational Totals</h2>
          <Stack direction="horizontal" gap={3}>
            <StatCard value={courseCount} unit={courseUnit} />
            <MemberStatsCard partner={partnerSlug} />
            <EnrollmentStatsCard partner={partnerSlug} />
            <EnrollmentStatsCard partner={partnerSlug} onlyComplete />
          </Stack>
        </Container>
      </section>

      <section className="p-3 py-5">
        <Container size="lg">
          <h2>Course Details</h2>
          <CourseEnrollmentList offerings={partnerOfferings ?? []} cohorts={cohorts} />
        </Container>
      </section>

      <section className="p-3 py-5">
        <Container size="lg">
          <h2>User Details</h2>
          <MembershipProvider>
            <MemberEnrollmentList offerings={partnerOfferings ?? []} cohorts={cohorts} />
          </MembershipProvider>
        </Container>
      </section>
    </>
  );
}
