import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ActionRow, Button, Form, ModalDialog,
} from '@edx/paragon';
import { selectAllMembers, addMember } from './membersSlice';

export default function AddMemberModal({ isOpen, onClose, catalog }) {
  const dispatch = useDispatch();
  const allMembers = useSelector(selectAllMembers);
  const catalogMemberEmails = allMembers
    .filter(member => member.catalog === catalog)
    .map(member => member.email);

  const [email, setEmail] = useState('');
  const onEmailChange = (e) => setEmail(e.target.value);
  const canAddEmail = email.length && !catalogMemberEmails.includes(email);

  const onAddMemberClicked = async () => {
    await dispatch(addMember({ catalog, email }));
    setEmail('');
    onClose();
  };

  return (
    <ModalDialog
      title="Add a member"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>Add a member</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" value={email} onChange={onEmailChange} />
          </Form.Group>
        </Form>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            Cancel
          </ModalDialog.CloseButton>
          <Button onClick={onAddMemberClicked} disabled={!canAddEmail}>
            Add member
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

AddMemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  catalog: PropTypes.string.isRequired,
};
