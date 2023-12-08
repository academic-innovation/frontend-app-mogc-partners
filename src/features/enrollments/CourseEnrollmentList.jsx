import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, DropdownFilter, TextFilter } from '@edx/paragon';
import useRecords from './useRecords';

import { getCohortFilterOptions } from '../../utils/forms';

function courseEnrollments(courseKey) {
  return (enrollment) => enrollment.offering.courseKey === courseKey;
}

function courseCompletions(courseKey) {
  return (enrollment) => (
    enrollment.isComplete && enrollment.offering.courseKey === courseKey
  );
}

export default function CourseEnrollmentList({ offerings, cohorts }) {
  const [enrollments, enrollmentsStatus] = useRecords();

  const data = offerings.map((offering) => ({
    title: offering.details.title,
    courseKey: offering.details.courseKey,
    cohort: offering.cohort,
    enrollments: enrollments.filter(
      courseEnrollments(offering.details.courseKey),
    ).length,
    completions: enrollments.filter(
      courseCompletions(offering.details.courseKey),
    ).length,
  }));

  const cohortFilterOptions = getCohortFilterOptions(cohorts);

  return (
    <DataTable
      isFilterable
      isLoading={enrollmentsStatus !== 'success'}
      enableHiding
      initialState={{ hiddenColumns: ['cohort'] }}
      data={data}
      defaultColumnValues={{ Filter: TextFilter }}
      itemCount={data.length}
      columns={[
        {
          Header: 'Filter by cohort',
          accessor: 'cohort',
          Filter: DropdownFilter,
          filter: 'equals',
          filterChoices: cohortFilterOptions,
        },
        { Header: 'Title', accessor: 'title', disableFilters: true },
        { Header: 'Enrollments', accessor: 'enrollments', disableFilters: true },
        { Header: 'Completions', accessor: 'completions', disableFilters: true },
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
  cohorts: PropTypes.arrayOf(PropTypes.object).isRequired,
};
