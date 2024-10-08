import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import {
  ActionRow, Alert, Button, Form, ModalDialog,
} from '@openedx/paragon';
import { importMembers } from './membersSlice';

const CSV_TEMPLATE_FILENAME = 'email_template.csv';

export default function ImportMembersModal({ isOpen, onClose, cohort }) {
  const dispatch = useDispatch();
  const [emailList, setEmailList] = useState([]);
  const [filename, setFilename] = useState('');
  const [errorMessage, setError] = useState('');

  const handleOnClose = (taskStarted) => {
    setError('');
    setFilename('');
    setEmailList([]);
    onClose(taskStarted);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFilename(file.name);

    try {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const result = readerEvent.target.result.split('\n');
        const cleanedEmails = result
          .map(email => email.trim().replace('\r', ''))
          .filter(email => email.length > 0);
        setEmailList(cleanedEmails);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
      setError('There was an error reading the uploaded file. Please verify and try again.');
    }
  }, []);

  const onImportMembersClicked = async () => {
    setError('');
    let taskStarted = false;
    try {
      const response = await dispatch(importMembers({ cohort, emailList }));
      taskStarted = [200, 201].includes(response.payload.status);
    } catch (err) {
      console.error(err);
      return setError('There was an error importing the list of members. Please verify and try again.');
    }
    return handleOnClose(taskStarted);
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
          <Button onClick={onImportMembersClicked}>
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
