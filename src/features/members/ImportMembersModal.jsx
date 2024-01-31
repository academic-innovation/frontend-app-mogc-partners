import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ActionRow, Button, Form, ModalDialog,
} from '@edx/paragon';
import { importMembers } from './membersSlice';

export default function ImportMembersModal({ isOpen, onClose, cohort }) {
  const dispatch = useDispatch();
  const [emailList, setEmailList] = useState([]);

  const handleOnClose = () => {
    setEmailList([]);
    onClose();
  };

  const onFileChange = (inputEvent) => {
    const file = inputEvent.target.files[0];
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const result = readerEvent.target.result.split('\n');
      const cleanedEmails = result.map(email => email.trim());
      setEmailList(cleanedEmails);
    };
    reader.readAsText(file);
  };

  const onImportMembersClicked = async () => {
    const response = await dispatch(importMembers({ cohort, emailList }));
    if (response.payload.length !== emailList.length) {
      console.log('Result count does not match input count');
    }
    handleOnClose();
  };

  return (
    <ModalDialog
      title="Add a member"
      isOpen={isOpen}
      onClose={handleOnClose}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>Import Learners</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form.Label>
          Use a CSV file to import many learners at once.{' '}
          Here is a template to make sure your file is correctly formatted:
        </Form.Label>
        <Form.Control type="file" onChange={onFileChange} />
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            Cancel
          </ModalDialog.CloseButton>
          <Button onClick={onImportMembersClicked} disabled={false}>
            Import
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

ImportMembersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cohort: PropTypes.string.isRequired,
};
