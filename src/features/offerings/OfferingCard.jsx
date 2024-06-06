import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import {
  ActionRow, Button, Card, ModalDialog, useToggle,
} from '@openedx/paragon';
import { selectOfferingById, enrollInCourse } from './offeringsSlice';

export default function OfferingCard({ offeringId }) {
  const offering = useSelector((state) => selectOfferingById(state, offeringId));
  const baseUrl = getConfig().LMS_BASE_URL;

  const aboutUrl = `${baseUrl}/courses/${offering.details.courseKey}/about`;

  const handleEnrollment = async () => {
    await enrollInCourse(offering.details.courseKey);
    window.location = `${baseUrl}${offering.continueLearningUrl}`;
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
            {offering.details.description ? (
              <Button onClick={open} variant="tertiary">More details</Button>
            ) : null }
            { /* <Button onClick={handleEnrollment}>Enroll</Button> */ }
            <Button href={aboutUrl}>Learn more</Button>
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
