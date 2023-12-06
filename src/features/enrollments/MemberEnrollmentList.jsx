import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { DataTable, DropdownFilter, TextFilter } from '@edx/paragon';
import uniqBy from 'lodash.uniqby';

import EntityContext from '../../common/EntityContext';
import useRecords from './useRecords';

import { getCohortFilterOptions } from "../../utils/forms.js";

function memberEnrollments(user) {
  return enrollment => enrollment.user === user;
}

function memberCompletions(user) {
  return enrollment => (
    enrollment.isComplete && enrollment.user === user
  );
}

export default function MemberEnrollmentList({ offerings, cohorts }) {
  const [enrollments] = useRecords();
  const courseKeys = offerings.map(offering => offering.details.courseKey);
  const offeringEnrollments = enrollments.filter(
    enrollment => courseKeys.includes(enrollment.offering.courseKey),
  );

  const { entities } = useContext(EntityContext);
  const members = uniqBy(entities, 'email');
  const data = members.map(member => ({
    name: member.name,
    email: member.email,
    cohort: member.cohort,
    enrollments: offeringEnrollments.filter(memberEnrollments(member.user)).length,
    completions: offeringEnrollments.filter(memberCompletions(member.user)).length,
  }));

  const cohortFilterOptions = getCohortFilterOptions(cohorts);

  return (
    <DataTable
      isFilterable
      isPaginated
      enableHiding
      initialState={{ pageSize: 20, hiddenColumns: ['cohort'] }}
      defaultColumnValues={{ Filter: TextFilter }}
      numBreakoutFilters={0}
      data={data}
      itemCount={data.length}
      columns={[
        { 
          Header: 'Filter by cohort', 
          accessor: 'cohort', 
          Filter: DropdownFilter, 
          filter: 'equals', 
          filterChoices: cohortFilterOptions,
          canFilter: true,
        },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Enrollments', accessor: 'enrollments' },
        { Header: 'Completions', accessor: 'completions' },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content="No members found." />
      <DataTable.TableFooter />
    </DataTable>
  );
}

MemberEnrollmentList.propTypes = {
  offerings: PropTypes.arrayOf(PropTypes.object).isRequired,
};
