import React from 'react';
import PropTypes from 'prop-types';

import StatCard from '../partners/StatCard';
import useRecords from './useRecords';

export default function EnrollmentStatsCard({ partner, onlyComplete }) {
  const singleUnit = onlyComplete ? 'Completion' : 'Enrollment';
  const singleUnitText = `Course ${singleUnit}`;
  const pluralUnit = onlyComplete ? 'Completions' : 'Enrollments';
  const pluralUnitText = `Course ${pluralUnit}`;
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
  const unit = enrollmentTotal === 1 ? singleUnitText : pluralUnitText;

  return <StatCard value={enrollmentTotal} unit={unit} isTotal />;
}

EnrollmentStatsCard.propTypes = {
  partner: PropTypes.string.isRequired,
  onlyComplete: PropTypes.bool,
};

EnrollmentStatsCard.defaultProps = {
  onlyComplete: false,
};
