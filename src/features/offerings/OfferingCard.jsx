import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  ActionRow, Button, Card, ModalDialog, useToggle,
} from '@edx/paragon';
import { selectOfferingById, enrollInOffering } from './offeringsSlice';

export default function OfferingCard({ offeringId }) {
  const offering = useSelector((state) => selectOfferingById(state, offeringId));
  const handleEnrollment = async () => {
    const response = await enrollInOffering(offering.id);
    window.location = response.courseHomeUrl;
  };
  const [isOpen, open, close] = useToggle(false);

  return (
    <>
      <Card>
        <Card.Header title={offering.details.title} />
        <Card.Section>
          {offering.details.shortDescription}
        </Card.Section>
        <Card.Footer>
          <ActionRow>
            <Button onClick={open} variant="tertiary">More details</Button>
            <Button onClick={handleEnrollment}>Enroll</Button>
          </ActionRow>
        </Card.Footer>
      </Card>

      <ModalDialog
        title=""
        isOpen={isOpen}
        onClose={close}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>{offering.details.title}</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <div dangerouslySetInnerHTML={{ __html: offering.details.description }} />
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Close
            </ModalDialog.CloseButton>
            <Button onClick={handleEnrollment}>
              Enroll
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

OfferingCard.propTypes = {
  offeringId: PropTypes.number.isRequired,
};
