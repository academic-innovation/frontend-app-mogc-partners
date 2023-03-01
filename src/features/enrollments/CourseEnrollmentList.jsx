import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@edx/paragon';
import useRecords from './useRecords';

function courseEnrollments(courseKey) {
  return enrollment => enrollment.offering.courseKey === courseKey;
}

function courseCompletions(courseKey) {
  return enrollment => (
    enrollment.isComplete && enrollment.offering.courseKey === courseKey
  );
}

export default function CourseEnrollmentList({ offerings }) {
  const [enrollments] = useRecords();

  const data = offerings.map(offering => ({
    title: offering.title,
    courseKey: offering.courseKey,
    enrollments: enrollments.filter(courseEnrollments(offering.courseKey)).length,
    completions: enrollments.filter(courseCompletions(offering.courseKey)).length,
  }));
  return (
    <DataTable
      data={data}
      itemCount={data.length}
      columns={[
        { Header: 'Title', accessor: 'title' },
        { Header: 'Enrollments', accessor: 'enrollments' },
        { Header: 'Completions', accessor: 'completions' },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content="No courses found." />
      <DataTable.TableFooter />
    </DataTable>
  );
}

CourseEnrollmentList.propTypes = {
  offerings: PropTypes.arrayOf(PropTypes.object).isRequired,
};
