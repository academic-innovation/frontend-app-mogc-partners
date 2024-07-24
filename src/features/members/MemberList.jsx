import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, CheckboxFilter, TextFilter } from '@openedx/paragon';
import { selectMembersByCohort } from './membersSlice';
import MemberActionRow from './MemberActionRow';
import { COHORT_MEMBERSHIP_STATUS, COHORT_MEMBERSHIP_STATUS_TYPE_MAP } from '../../utils/constants';
import useMembers from './useMembers';

export default function MemberList({ cohort }) {
  const [cohortMembers] = useMembers(state => selectMembersByCohort(state, cohort));
  if (!cohortMembers.length) {
    return <p>No members have been invited to this cohort.</p>;
  }

  const memberData = cohortMembers.map(member => ({
    id: member.id,
    email: member.email,
    status: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[member.status],
    active: member.active,
  }));

  const memberActionRows = memberData.reduce((componentList, member) => {
    componentList[member.id] = <MemberActionRow member={member} cohort={cohort} />;
    return componentList;
  }, {});

  const statusFilterChoices = [
    {
      name: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.activated],
      value: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.activated],
    },
    {
      name: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.invited],
      value: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.invited],
    },
    {
      name: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.deactivated],
      value: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.deactivated],
    },
  ];

  return (
    <section className="mt-3">
      <DataTable
        isFilterable
        isPaginated
        isSortable
        initialState={{ hiddenColumns: ['id', 'active'] }}
        itemCount={cohortMembers.length}
        defaultColumnValues={{ Filter: TextFilter }}
        numBreakoutFilters={1}
        data={memberData}
        columns={[
          { Header: 'Membership ID', accessor: 'id', disableFilters: true },
          { Header: 'Email', accessor: 'email' },
          { Header: 'Active', accessor: 'active', disableFilters: true },
          {
            Header: 'Status',
            accessor: 'status',
            Filter: CheckboxFilter,
            filter: 'includesValue',
            filterChoices: statusFilterChoices,
          },
        ]}
        additionalColumns={[
          {
            id: 'action',
            Header: 'Action',
            Cell: ({ row }) => (memberActionRows[row.values.id]),
          },
        ]}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content="No results found" />
        <DataTable.TableFooter />
      </DataTable>
    </section>
  );
}

MemberList.propTypes = {
  cohort: PropTypes.string.isRequired,
};
