import React from 'react';
import { Container, Stack } from '@edx/paragon';
import { Link } from 'react-router-dom';

import MemberStatsCard from '../members/MemberStatCard';
import EnrollmentStatsCard from '../enrollments/EnrollmentStatCard';
import CourseEnrollmentList from '../enrollments/CourseEnrollmentList';
import usePartner from './usePartner';
import StatCard from './StatCard';

export default function PartnerStats() {
  const [partner, partnerSlug] = usePartner();

  const courseCount = partner?.offerings.length;
  const courseUnit = courseCount === 1 ? 'Course' : 'Courses';

  return (
    <>
      <section className="px-3 py-5 bg-primary">
        <Container size="lg">
          <Stack direction="horizontal" gap={3} className="justify-content-between">
            <h1 className="text-white">{partner?.name}</h1>
            <Link className="btn btn-inverse-outline-primary" to={`/${partnerSlug}/admin`}>
              Manage
            </Link>
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
          <CourseEnrollmentList offerings={partner?.offerings ?? []} />
        </Container>
      </section>
    </>
  );
}