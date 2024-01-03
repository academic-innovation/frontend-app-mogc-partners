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

  const offeringsMap = offerings.reduce((offeringsCourseMap, offering) => {
    const offeringCourseKey = offering.details.courseKey;
    if (Object.keys(offeringsCourseMap).includes(offeringCourseKey)) {
      offeringsCourseMap[offeringCourseKey].cohorts.push(offering.cohort);
    } else {
      offeringsCourseMap[offeringCourseKey] = {
        title: offering.details.title,
        courseKey: offeringCourseKey,
        cohorts: [offering.cohort],
        enrollments: enrollments.filter(
          courseEnrollments(offeringCourseKey),
        ).length,
        completions: enrollments.filter(
          courseCompletions(offeringCourseKey),
        ).length,
      };
    }
    return offeringsCourseMap;
  }, {});

  const data = Object.keys(offeringsMap).map(
    offeringCourseKey => offeringsMap[offeringCourseKey],
  );

  const cohortFilterOptions = getCohortFilterOptions(cohorts);

  return (
    <DataTable
      isFilterable
      isLoading={enrollmentsStatus !== 'success'}
      enableHiding
      initialState={{ hiddenColumns: ['cohorts'] }}
      data={data}
      defaultColumnValues={{ Filter: TextFilter }}
      itemCount={data.length}
      columns={[
        {
          Header: 'Filter by cohort',
          accessor: 'cohorts',
          Filter: DropdownFilter,
          filter: 'includes',
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
