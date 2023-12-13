import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ActionRow, Button, Container, Form, ModalDialog, useToggle,
} from '@edx/paragon';
import { Add } from '@edx/paragon/icons';

import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import CohortList from '../cohorts/CohortList';
import ManagementMenu from './ManagementMenu';
import PartnerHeading from './PartnerHeading';

import usePartner from './usePartner';
import { addCohort } from '../cohorts/cohortsSlice';

export default function PartnerDetails() {
  const [partner, partnerSlug] = usePartner();
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
      <PartnerHeading partnerName={partner?.name}>
        <ManagementMenu partner={partnerSlug} />
      </PartnerHeading>

      <section className="p-3 py-5">
        <Container size="lg">
          <ResponsiveBreadcrumb
            links={[
              { label: 'Partners', url: '' },
              { label: partner?.name, url: `/${partnerSlug}/details` },
            ]}
            activeLabel="Cohort"
          />
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
