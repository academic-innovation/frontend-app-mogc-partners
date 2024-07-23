import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Button, useToggle,
} from '@openedx/paragon';
import StatusChangeConfirmationModal from './StatusChangeConfirmationModal';
import { updateMember } from './membersSlice';

export default function MemberActionRow({ member, cohort }) {
  const dispatch = useDispatch();
  const [isModalOpen, openModal, closeModal] = useToggle(false);

  if (!member) {
    return null;
  }

  const toggleMemberStatus = () => {
    const { id: membershipId, active, email } = member;

    const payload = { email, active: !active };

    dispatch(updateMember({ cohort, membershipId, payload }));
    closeModal();
  };

  const toggleStatusButtonText = () => (
    member.active ? 'Deactivate' : 'Activate'
  );

  return (
    <>
      <Button
        variant="link"
        size="sm"
        onClick={openModal}
      >
        {toggleStatusButtonText(member)}
      </Button>
      <StatusChangeConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={toggleMemberStatus}
        user={member}
      />
    </>
  );
}

MemberActionRow.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    status: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
  cohort: PropTypes.string.isRequired,
};
