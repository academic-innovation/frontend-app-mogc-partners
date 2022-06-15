import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { CardGrid } from '@edx/paragon';

import { fetchEnrollments, selectAllEnrollments } from './enrollmentsSlice';
import EnrollmentCard from './EnrollmentCard';

export default function UserEnrollmentList({ courseIds }) {
  // TODO: Only display enrollments associated with a partner.
  const dispatch = useDispatch();
  const enrollments = useSelector(selectAllEnrollments);
  const enrollmentsStatus = useSelector(state => state.enrollments.status);
  useEffect(() => {
    if (enrollmentsStatus === 'idle') {
      dispatch(fetchEnrollments());
    }
  }, [enrollmentsStatus, dispatch]);

  const filteredEnrollments = enrollments.filter(
    enrollment => courseIds.includes(enrollment.courseDetails.courseId),
  );

  const enrollmentCards = filteredEnrollments.map(
    enrollment => <EnrollmentCard enrollmentId={enrollment.courseDetails.courseId} />,
  );
  return (
    <CardGrid>
      {enrollmentCards}
    </CardGrid>
  );
}

UserEnrollmentList.propTypes = {
  courseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
