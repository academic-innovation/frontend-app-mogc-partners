import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@edx/paragon';

export default function EnrollmentCard({ enrollmentId }) {
  return (
    <Card>
      <Card.Section>EnrollmentCard: {enrollmentId}</Card.Section>
    </Card>
  );
}

EnrollmentCard.propTypes = {
  enrollmentId: PropTypes.string.isRequired,
};
