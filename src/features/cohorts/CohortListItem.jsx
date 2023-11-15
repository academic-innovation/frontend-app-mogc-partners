import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  ActionRow, Alert, Card, Button, Form, ModalDialog, useToggle,
} from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import { selectCohortById, deleteCohort, updateCohort } from './cohortsSlice';

import CohortMemberCount from '../members/CohortMemberCount';
import CohortOfferingCount from '../offerings/CohortOfferingCount';

export default function CohortListItem({ uuid }) {
  const dispatch = useDispatch();
  const cohort = useSelector(state => selectCohortById(state, uuid));
  const [cohortName, setCohortName] = useState(cohort.name);
  const [cohortConfirmation, setCohortConfirmation] = useState('');
  const [isOpen, open, close] = useToggle(false);
  const [deleteIsOpen, openDelete, closeDelete] = useToggle(false);

  const CONFIRM_TEXT = "DELETE"

  const onCohortDeletionConfirmed = () => {
    dispatch(deleteCohort(uuid));
    setCohortConfirmation('');
    closeDelete();
  };

  const onCohortNameChanged = (e) => setCohortName(e.target.value);

  const onCohortConfirmationChanged = (e) => setCohortConfirmation(e.target.value);

  const canDelete = cohortConfirmation === CONFIRM_TEXT;

  const onUpdateSubmitted = async () => {
    await dispatch(
      updateCohort({
        uuid, cohortUpdates: { partner: cohort.partner, name: cohortName },
      }),
    );
    close();
  };

  return (
    <>
      <Card orientation="horizontal" className="mb-4">
        <Card.Section>
          <h3>{cohort.name}</h3>
          <p>
            <CohortOfferingCount cohort={cohort.uuid} />{' '}
            <CohortMemberCount cohort={cohort.uuid} />
          </p>
        </Card.Section>
        <Card.Footer className="justify-content-end w-auto">
          <Link
            to={`/${cohort.partner}/admin/catalog/${cohort.uuid}`}
            className="btn btn-primary"
          >
            View
          </Link>
          <Button variant="secondary" onClick={open}>Rename</Button>
          <Button variant="outline-danger" onClick={openDelete}>Delete</Button>
        </Card.Footer>
      </Card>

      <ModalDialog
        title="Delete cohort"
        isOpen={deleteIsOpen}
        onClose={closeDelete}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Delete {cohort.name}
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          <Alert variant="danger" icon={Info}>
            <Alert.Heading>You are about to permanently delete this cohort.</Alert.Heading>
            <p>
              Deleting a cohort deletes all memberships and offerings within it.
            </p>
          </Alert>

          <p>Please type <strong>DELETE</strong> to confirm.</p>

          <Form>
            <Form.Group>
              <Form.Control
                type="text"
                value={cohortConfirmation}
                onChange={onCohortConfirmationChanged}
                placeholder="Type confirmation here"
                aria-label="Type confirmation here"
              />
            </Form.Group>
          </Form>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button
              onClick={onCohortDeletionConfirmed}
              variant="danger"
              disabled={!canDelete}
            >
              Delete
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>

      <ModalDialog
        title="Edit this!"
        isOpen={isOpen}
        onClose={close}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Rename {cohort.name}
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          <Form>
            <Form.Group>
              <Form.Label>Cohort Name</Form.Label>
              <Form.Control
                type="text"
                value={cohortName}
                onChange={onCohortNameChanged}
              />
            </Form.Group>
          </Form>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button onClick={onUpdateSubmitted}>
              Submit
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

CohortListItem.propTypes = {
  uuid: PropTypes.string.isRequired,
};
