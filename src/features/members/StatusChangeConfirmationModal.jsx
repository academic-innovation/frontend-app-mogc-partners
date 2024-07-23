import React from 'react';
import PropTypes from 'prop-types';
import { ActionRow, Button, ModalDialog } from '@openedx/paragon';
import { COHORT_MEMBERSHIP_STATUS, COHORT_MEMBERSHIP_STATUS_TYPE_MAP } from '../../utils/constants';

export default function StatusChangeConfirmationModal({
  isOpen, onClose, onSave, user,
}) {
  let statusText = 'deactivate';
  let actionDescription = 'Deactivating a user will unenroll them in any courses they are currently enrolled in for this cohort.';
  if (
    user.status
    === COHORT_MEMBERSHIP_STATUS_TYPE_MAP[COHORT_MEMBERSHIP_STATUS.deactivated]
  ) {
    statusText = 'activate';
    actionDescription = '';
  }

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
        <p>Are you sure you want to {statusText} {user.email}?</p>
        <p>{actionDescription}</p>
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
