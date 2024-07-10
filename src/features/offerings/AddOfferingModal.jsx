import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ActionRow, Button, Form, ModalDialog,
} from '@openedx/paragon';
import { addOffering, selectAllOfferings } from './offeringsSlice';
import useOfferings from './useOfferings';

export default function AddOfferingModal({
  isOpen,
  onClose,
  cohort,
  partnerOfferings,
}) {
  const dispatch = useDispatch();
  const [offerings] = useOfferings(selectAllOfferings);
  const cohortOfferings = offerings
    .filter((offering) => offering.cohort === cohort)
    .map((offering) => offering.offering);
  const availableOfferings = partnerOfferings.filter(
    (offering) => !cohortOfferings.includes(offering.id),
  );
  const [offeringId, setOfferingId] = useState('');

  const onCourseChange = (e) => setOfferingId(e.target.value);

  const onAddCourseClicked = () => {
    dispatch(addOffering({ cohort, offering: offeringId }));
    onClose();
  };

  const options = availableOfferings.map((offering) => (
    <option key={offering.id} value={offering.id}>
      {offering.title}
    </option>
  ));

  return (
    <ModalDialog title="Add a course" isOpen={isOpen} onClose={onClose}>
      <ModalDialog.Header>
        <ModalDialog.Title>Add a course</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form>
          <Form.Group>
            <Form.Label>Course</Form.Label>
            <Form.Control
              as="select"
              value={offeringId}
              onChange={onCourseChange}
            >
              <option value="">Select a course</option>
              {options}
            </Form.Control>
          </Form.Group>
        </Form>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            Cancel
          </ModalDialog.CloseButton>
          <Button onClick={onAddCourseClicked}>Add course</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

AddOfferingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cohort: PropTypes.string.isRequired,
  partnerOfferings: PropTypes.arrayOf(
    PropTypes.shape({
      courseKey: PropTypes.string,
      id: PropTypes.number,
      partner: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
};
