import React from 'react';
import PropTypes from 'prop-types';

import StatCard from '../partners/StatCard';
import useRecords from './useRecords';

export default function EnrollmentStatsCard({ partner, onlyComplete }) {
  const unitText = 'Total Course';
  const singleUnit = onlyComplete ? 'Completion' : 'Enrollment';
  const pluralUnit = onlyComplete ? 'Completions' : 'Enrollments';
  const [enrollments, status] = useRecords();
  if (status !== 'success') {
    return <StatCard value="--" unit="Enrollments" />;
  }
  const enrollmentTotal = enrollments.filter(enrollment => {
    if (enrollment.offering.partner !== partner) {
      return false;
    }
    return onlyComplete ? enrollment.isComplete : true;
  }).length;
  const unit = enrollmentTotal === 1 ? singleUnit : pluralUnit;

  return <StatCard value={enrollmentTotal} unit={unitText} secondary={unit} />;
}

EnrollmentStatsCard.propTypes = {
  partner: PropTypes.string.isRequired,
  onlyComplete: PropTypes.bool,
};

EnrollmentStatsCard.defaultProps = {
  onlyComplete: false,
};
