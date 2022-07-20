import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { DataTable, DropdownFilter, TextFilter } from '@edx/paragon';
import { selectAllMembers, fetchMembers } from './membersSlice';

export default function MemberList({ catalog }) {
  const dispatch = useDispatch();
  const memberStatus = useSelector(state => state.members.status);
  const allMembers = useSelector(selectAllMembers);
  const catalogMembers = allMembers.filter(member => member.catalog === catalog);

  useEffect(() => {
    if (memberStatus === 'idle') {
      dispatch(fetchMembers());
    }
  }, [memberStatus, dispatch]);

  if (!catalogMembers.length) {
    return <p>No members have been invited to this catalog.</p>;
  }

  const memberData = catalogMembers.map(member => ({
    email: member.email,
    status: member.user ? 'Registered' : 'Invited',
  }));

  return (
    <section>
      <DataTable
        isFilterable
        isSortable
        itemCount={catalogMembers.length}
        defaultColumnValues={{ Filter: TextFilter }}
        numBreakoutFilters={2}
        data={memberData}
        columns={[
          { Header: 'Email', accessor: 'email' },
          {
            Header: 'Status',
            accessor: 'status',
            Filter: DropdownFilter,
            filter: 'includesValue',
            filterChoices: [
              { name: 'Registered', value: 'Registered' },
              { name: 'Invited', value: 'Invited' },
            ],
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
  catalog: PropTypes.string.isRequired,
};
