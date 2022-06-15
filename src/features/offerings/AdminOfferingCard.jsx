import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card } from '@edx/paragon';
import { selectOfferingById } from './offeringsSlice';

export default function AdminOfferingCard({ offeringId }) {
  const offering = useSelector((state) => selectOfferingById(state, offeringId));
  return (
    <Card>
      <Card.Section className="text-center">
        <h3>{offering.details.title}</h3>
        <p>{offering.details.courseKey}</p>
      </Card.Section>
    </Card>
  );
}

AdminOfferingCard.propTypes = {
  offeringId: PropTypes.number.isRequired,
};
