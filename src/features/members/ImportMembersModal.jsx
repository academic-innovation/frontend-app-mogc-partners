import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import {
  ActionRow, Alert, Button, Form, ModalDialog,
} from '@edx/paragon';
import { importMembers } from './membersSlice';

const CSV_TEMPLATE_FILENAME = 'email_template.csv';

export default function ImportMembersModal({ isOpen, onClose, cohort }) {
  const dispatch = useDispatch();
  const [emailList, setEmailList] = useState([]);
  const [filename, setFilename] = useState('');
  const [errorMessage, setError] = useState('');

  const handleOnClose = () => {
    setError('');
    setFilename('');
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
  }, []);

  const onImportMembersClicked = async () => {
    setError('');
    try {
      const response = await dispatch(importMembers({ cohort, emailList }));
      const expectedNumMembers = emailList.length;
      const numMembersImported = Array.from(response.payload?.members)?.length;
      if (numMembersImported !== expectedNumMembers) {
        return setError(`The uploaded list contained duplicates or invalid emails. Added ${numMembersImported} out of ${expectedNumMembers} expected members.`);
      }
    } catch (err) {
      console.error(err);
      return setError(`Error uploading file: ${err.message}`);
    }
    return handleOnClose();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const generateTemplate = () => {
    const rows = [...Array(3).keys()].map(n => `email${n}@example.com`);
    const csvContent = `data:text/csv;charset=utf-8,${rows.join('\n')}`;
    return encodeURI(csvContent);
  };

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
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form.Label>
          Use a CSV file to import many learners at once.{' '}
          Here is a template to make sure your file is correctly formatted:
        </Form.Label>
        <div className="mt-3 mb-3">
          <Button variant="outline-primary" href={generateTemplate()} download={CSV_TEMPLATE_FILENAME}>Use template</Button>
        </div>
        <div {...getRootProps({ className: `dropzone${isDragActive ? ' active' : ''}` })}>
          <input {...getInputProps()} />
          {isDragActive
            ? <p className="mt-3">Drop CSV file here</p>
            : (
              <>
                <Button variant="outline-dark">Browse</Button>
                <p className="mt-3">{ emailList.length > 0 ? filename : 'Or drag and drop a CSV file'}</p>
              </>
            )}
        </div>
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
