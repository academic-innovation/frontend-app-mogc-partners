import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, DropdownFilter, TextFilter } from '@edx/paragon';
import useMembers from './useMembers';

export default function MemberList({ catalog }) {
  const [allMembers] = useMembers();
  const catalogMembers = allMembers.filter(member => member.catalog === catalog);

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
