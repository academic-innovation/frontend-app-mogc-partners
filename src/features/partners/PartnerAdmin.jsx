import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ActionRow, Button, Container, Form, ModalDialog, useToggle,
} from '@openedx/paragon';
import { Add } from '@openedx/paragon/icons';

import PartnerHeader from './PartnerHeader/PartnerHeader';
import CohortList from '../cohorts/CohortList';

import usePartner from './usePartner';
import { addCohort } from '../cohorts/cohortsSlice';

export default function PartnerDetails() {
  const [, partnerSlug] = usePartner();
  const dispatch = useDispatch();
  const [isOpen, open, close] = useToggle(false);
  const [name, setName] = useState('');

  const onNameChanged = (e) => setName(e.target.value);

  const canCreateCohort = name.length > 0;
  const createCohort = async () => {
    if (canCreateCohort) {
      try {
        await dispatch(addCohort({ name, partner: partnerSlug }));
        setName('');
        close();
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    }
  };

  return (
    <>
      <PartnerHeader selectedView="partnerAdmin" activeLabel="Cohorts" />

      <section className="p-3 py-5">
        <Container size="lg">
          <h2>Available Cohorts</h2>
          <CohortList partnerSlug={partnerSlug} />
          <div>
            <Button iconBefore={Add} onClick={open}>Add cohort</Button>
          </div>
        </Container>
      </section>

      <ModalDialog
        title="Add new cohort"
        isOpen={isOpen}
        onClose={close}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>Add new cohort</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Form>
            <Form.Group>
              <Form.Label>Cohort name</Form.Label>
              <Form.Control value={name} onChange={onNameChanged} />
            </Form.Group>
          </Form>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button onClick={createCohort} disabled={!canCreateCohort}>
              Create
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}
