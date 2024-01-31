import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import {
  ActionRow, Button, Form, ModalDialog,
} from '@edx/paragon';
import { importMembers } from './membersSlice';

export default function ImportMembersModal({ isOpen, onClose, cohort }) {
  const dispatch = useDispatch();
  const [emailList, setEmailList] = useState([]);
  const [filename, setFilename] = useState('');

  const handleOnClose = () => {
    setEmailList([]);
    onClose();
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const result = readerEvent.target.result.split('\n');
      const cleanedEmails = result.map(email => email.trim());
      setEmailList(cleanedEmails);
    };
    reader.readAsText(file);
  });

  const onImportMembersClicked = async () => {
    const response = await dispatch(importMembers({ cohort, emailList }));
    if (response.payload.length !== emailList.length) {
      console.log('Result count does not match input count');
    }
    handleOnClose();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <ModalDialog
      title="Import members"
      isOpen={isOpen}
      onClose={handleOnClose}
      width="lg"
    >
      <ModalDialog.Header>
        <ModalDialog.Title>Import Learners</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form.Label>
          Use a CSV file to import many learners at once.{' '}
          Here is a template to make sure your file is correctly formatted:
        </Form.Label>
        <div className="mt-3 mb-3">
          <Button variant="outline-primary">Download template</Button>
        </div>
        <div {...getRootProps({ className: `dropzone${isDragActive ? ' active' : ''}` })}>
          <input {...getInputProps()} />
          {isDragActive
            ? <p>Drop CSV file here</p>
            : (
              <>
                <Button variant="outline-dark">Browse</Button>
                <p className="mt-3">Or drag and drop a CSV file</p>
              </>
            )}
        </div>
        {emailList.length > 0 && <p className="mt-3">File: {filename}</p>}
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
