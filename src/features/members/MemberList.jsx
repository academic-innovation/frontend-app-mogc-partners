import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  ActionRow, DataTable, Button, CheckboxFilter, TextFilter, useToggle, ModalDialog,
} from '@openedx/paragon';
import { updateMember, selectMembersByCohort } from './membersSlice';
import { COHORT_MEMBERSHIP_STATUS, COHORT_MEMBERSHIP_STATUS_TYPE_MAP } from '../../utils/constants';
import useMembers from './useMembers';

function StatusChangeConfirmationModal({
  isOpen, onClose, onSave, user,
}) {
  return (
    <ModalDialog
      title="Deactivate member"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>Change member status</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p>Are you sure you want to deactivate {user.email}?</p>
        <p>
          Deactivating a user will unenroll them in any courses they
          are currently enrolled in for this cohort.
        </p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            Cancel
          </ModalDialog.CloseButton>
          <Button onClick={() => onSave(user)}>Save</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

export default function MemberList({ cohort }) {
  const dispatch = useDispatch();

  const [isModalOpen, openModal, closeModal] = useToggle(false);

  const toggleMemberStatus = (member) => {
    const { id: membershipId, email, status } = member;

    const active = ![
      COHORT_MEMBERSHIP_STATUS.activated,
      COHORT_MEMBERSHIP_STATUS.invited,
    ].includes(status);
    const payload = { email, active: !active };

    dispatch(updateMember({ cohort, membershipId, payload }));
    closeModal();
  };

  const toggleStatusButtonText = (member) => (
    member.active ? 'Activate' : 'Deactivate'
  );

  const [cohortMembers] = useMembers(state => selectMembersByCohort(state, cohort));
  if (!cohortMembers.length) {
    return <p>No members have been invited to this cohort.</p>;
  }

  const memberData = cohortMembers.map(member => ({
    id: member.id,
    email: member.email,
    user: member.user, // undefined??
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
              <>
                <Button
                  variant="link"
                  size="sm"
                  onClick={openModal}
                >
                  {toggleStatusButtonText(row.values)}
                </Button>
                <StatusChangeConfirmationModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  onSave={toggleMemberStatus}
                  user={row.values}
                />
              </>
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

StatusChangeConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
