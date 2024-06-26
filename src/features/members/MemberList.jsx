import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  DataTable, Button, CheckboxFilter, TextFilter,
} from '@openedx/paragon';
import { updateMember, selectMembersByCohort } from './membersSlice';
import { COHORT_MEMBERSHIP_STATUS, COHORT_MEMBERSHIP_STATUS_TYPE_MAP } from '../../utils/constants';
import useMembers from './useMembers';

export default function MemberList({ cohort }) {
  const dispatch = useDispatch();

  const toggleMemberStatus = (member) => {
    const { id: membershipId, email, status } = member.values;

    let newStatus;
    switch (status) {
      case COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.active]:
        newStatus = COHORT_MEMBERSHIP_STATUS.deactivated;
        break;
      case COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.invited]:
        newStatus = COHORT_MEMBERSHIP_STATUS.deactivated;
        break;
      case COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.deactivated]:
        newStatus = member.user
          ? COHORT_MEMBERSHIP_STATUS.activated
          : COHORT_MEMBERSHIP_STATUS.invited;
        break;
      default:
        newStatus = member.status;
    }

    const payload = {
      email,
      status: newStatus,
    };
    dispatch(updateMember({ cohort, membershipId, payload }));
  };

  const toggleStatusButtonText = (member) => ([
    COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.activated],
    COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.invited],
  ].includes(member.values.status)
    ? 'Deactivate'
    : 'Activate'
  );

  const [cohortMembers] = useMembers(state => selectMembersByCohort(state, cohort));
  if (!cohortMembers.length) {
    return <p>No members have been invited to this cohort.</p>;
  }

  const memberData = cohortMembers.map(member => ({
    id: member.id,
    email: member.email,
    user: member.user,
    status: COHORT_MEMBERSHIP_STATUS_TYPE_MAP[member.status],
  }));

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
        initialState={{ hiddenColumns: ['id'] }}
        itemCount={cohortMembers.length}
        defaultColumnValues={{ Filter: TextFilter }}
        numBreakoutFilters={2}
        data={memberData}
        columns={[
          { Header: 'Membership ID', accessor: 'id' },
          { Header: 'Email', accessor: 'email' },
          {
            Header: 'Status',
            accessor: 'status',
            Filter: CheckboxFilter,
            filter: 'includesValue',
            filterChoices: statusFilterChoices,
          },
          {
            Header: 'Action',
            /* eslint-disable */
            Cell: ({ row }) => (
              <Button
                variant="link"
                size="sm"
                onClick={() => toggleMemberStatus(row)}
              >
                {toggleStatusButtonText(row)}
              </Button>
            ),
            /* eslint-enable */
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
