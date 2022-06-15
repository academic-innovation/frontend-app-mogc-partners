import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Button, Card } from '@edx/paragon';
import { selectOfferingById } from './offeringsSlice';

export default function OfferingCard({ offeringId }) {
  const offering = useSelector((state) => selectOfferingById(state, offeringId));
  const baseUrl = getConfig().LMS_BASE_URL;
  const continueUrl = `${baseUrl}${offering.continueLearningUrl}`;
  return (
    <Card orientation="horizontal">
      <Card.Section>
        <h3>{offering.details.title}</h3>
        <p>Enrolled</p>
      </Card.Section>
      <Card.Footer className="justify-content-end flex-min-content">
        <Button href={continueUrl}>Continue</Button>
      </Card.Footer>
    </Card>
  );
}

OfferingCard.propTypes = {
  offeringId: PropTypes.number.isRequired,
};
