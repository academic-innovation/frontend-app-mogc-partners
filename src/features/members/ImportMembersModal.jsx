import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ActionRow, Alert, Button, Dropzone, Form, ModalDialog,
} from '@openedx/paragon';
import { WarningAmber } from '@openedx/paragon/icons';
import { importMembers } from './membersSlice';
import { MEBIBYTE } from '../../utils/constants';

const FilledDropzone = ({ filename, count }) => (
  <>
    <p>{filename}</p>
    {count === 0 && (
      <Alert variant="warning" icon={WarningAmber} className="w-100">
        This file appears to be empty.
      </Alert>
    )}
  </>
);

FilledDropzone.propTypes = {
  filename: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

const generateTemplate = () => {
  const rows = [...Array(3).keys()].map(n => `email${n}@example.com`);
  const csvContent = `data:text/csv;charset=utf-8,${rows.join('\n')}\n`;
  return encodeURI(csvContent);
};

export default function ImportMembersModal({
  isOpen, closeModal, onMembersImported, cohort,
}) {
  const dispatch = useDispatch();
  const [emailList, setEmailList] = useState([]);
  const [filename, setFilename] = useState('');
  const [errorMessage, setError] = useState('');
  const templateUrl = useMemo(() => generateTemplate(), []);

  const clearFileState = () => {
    setFilename('');
    setEmailList([]);
  };

  const onClose = () => {
    setError('');
    clearFileState();
    closeModal();
  };

  const processFile = ({ fileData }) => {
    setError('');
    const file = fileData.get('file');
    file.text().then(text => {
      const cleanedEmails = text
        .split('\n')
        .map(email => email.trim().replace('\r', ''))
        .filter(email => email.length > 0);

      setEmailList(cleanedEmails);
      setFilename(file.name);
    });
  };

  const onImportMembersClicked = async () => {
    setError('');
    try {
      const response = await dispatch(importMembers({ cohort, emailList }));
      const newMembers = response.payload.members;
      const numMembersImported = Object.keys(newMembers).length;

      onMembersImported(numMembersImported);
      onClose();
    } catch {
      clearFileState();
      setError('There was an error reading the uploaded file, or the file included invalid email addresses. Please verify and try again.');
    }
  };

  return (
    <ModalDialog
      title="Import members"
      isOpen={isOpen}
      onClose={onClose}
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
          <Button variant="outline-primary" href={templateUrl} download="email_template.csv">Use template</Button>
        </div>

        <div className="mb-3">
          <Dropzone
            accept={{ 'text/csv': ['.csv'] }}
            maxSize={1 * MEBIBYTE}
            onProcessUpload={processFile}
            inputComponent={filename
              ? <FilledDropzone filename={filename} count={emailList.length} />
              : undefined}
          />
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            Cancel
          </ModalDialog.CloseButton>
          <Button onClick={onImportMembersClicked} disabled={!filename}>
            Import
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

ImportMembersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onMembersImported: PropTypes.func.isRequired,
  cohort: PropTypes.string.isRequired,
};
