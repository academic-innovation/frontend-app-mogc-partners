import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import ImportMembersModal from './ImportMembersModal';
import { MEBIBYTE } from '../../utils/constants';
import { IntlReduxWrapper as wrapper } from '../../utils/testing';

const createFile = (sizeBytes, type, name) => {
  const file = new File([' '.repeat(sizeBytes)], name, { type });
  Object.defineProperty(file, 'size', { get() { return sizeBytes; } });
  return file;
};

const createDataTransfer = (files) => ({
  dataTransfer: {
    files,
    items: files.map(file => ({
      kind: 'file',
      size: file.size,
      type: file.type,
      getAsFile: () => file,
    })),
    types: ['Files'],
  },
});

test('disables import button and displays alert when file size exceeds limit', async () => {
  render(
    <ImportMembersModal
      isOpen
      closeModal={jest.fn()}
      onMembersImported={jest.fn()}
      cohort="cohort-1"
    />,
    { wrapper },
  );
  const bigFile = createFile(1.1 * MEBIBYTE, 'text/csv', 'brobdingnag.csv');
  const dataTransfer = createDataTransfer([bigFile]);
  const dropZone = await screen.findByTestId('dropzone');

  await act(async () => fireEvent.drop(dropZone, dataTransfer));

  const importButton = await screen.findByRole('button', { name: 'Import' });
  expect(importButton).toBeDisabled();
  expect(dropZone).toHaveTextContent('File must be less than 1MB.');
});
