import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ActionRow, Button, Card } from '@edx/paragon';
import { selectOfferingById, enrollInOffering } from './offeringsSlice';

export default function OfferingCard({ offeringId }) {
  const offering = useSelector((state) => selectOfferingById(state, offeringId));
  const handleEnrollment = async () => {
    const response = await enrollInOffering(offering.id);
    window.location = response.courseHomeUrl;
  };
  return (
    <Card>
      <Card.Header title={offering.details.title} />
      <Card.Section>
        {offering.details.shortDescription}
      </Card.Section>
      <Card.Footer>
        <ActionRow>
          <Button onClick={handleEnrollment}>Enroll</Button>
        </ActionRow>
      </Card.Footer>
    </Card>
  );
}

OfferingCard.propTypes = {
  offeringId: PropTypes.number.isRequired,
};
