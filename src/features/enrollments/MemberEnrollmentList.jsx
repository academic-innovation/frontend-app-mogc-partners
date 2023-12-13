import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { DataTable, DropdownFilter, TextFilter } from '@edx/paragon';

import EntityContext from '../../common/EntityContext';
import useRecords from './useRecords';

import { getCohortFilterOptions } from '../../utils/forms';

function memberEnrollments(user) {
  return enrollment => enrollment.user === user;
}

function memberCompletions(user) {
  return enrollment => (
    enrollment.isComplete && enrollment.user === user
  );
}

export default function MemberEnrollmentList({ offerings, cohorts }) {
  const [enrollments, enrollmentsStatus] = useRecords();
  const courseKeys = offerings.map(offering => offering.details.courseKey);
  const offeringEnrollments = enrollments.filter(
    enrollment => courseKeys.includes(enrollment.offering.courseKey),
  );

  const { entities } = useContext(EntityContext);
  const members = entities.reduce((membersMap, member) => {
    if (Object.keys(membersMap).includes(member.email)) {
      membersMap[member.email].cohorts.push(member.cohort);
    } else {
      membersMap[member.email] = {
        name: member.name,
        email: member.email,
        cohorts: [member.cohort],
        enrollments: offeringEnrollments.filter(memberEnrollments(member.user)).length,
        completions: offeringEnrollments.filter(memberCompletions(member.user)).length,
      };
    }
    return membersMap;
  }, {});
  const data = Object.keys(members).map(memberEmail => members[memberEmail]);

  const cohortFilterOptions = getCohortFilterOptions(cohorts);

  return (
    <DataTable
      isFilterable
      isPaginated
      isLoading={enrollmentsStatus !== 'success'}
      enableHiding
      initialState={{ pageSize: 20, hiddenColumns: ['cohorts'] }}
      defaultColumnValues={{ Filter: TextFilter }}
      numBreakoutFilters={2}
      data={data}
      itemCount={data.length}
      columns={[
        {
          Header: 'Filter by cohort',
          accessor: 'cohorts',
          Filter: DropdownFilter,
          filter: 'includes',
          filterChoices: cohortFilterOptions,
          canFilter: true,
        },
        { Header: 'Name', accessor: 'name', disableFilters: true },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Enrollments', accessor: 'enrollments', disableFilters: true },
        { Header: 'Completions', accessor: 'completions', disableFilters: true },
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
  cohorts: PropTypes.arrayOf(PropTypes.object).isRequired,
};
