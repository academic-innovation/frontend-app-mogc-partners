import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form } from '@edx/paragon';
import { selectAllOfferings, addOffering } from './offeringsSlice';

export default function AddOfferingForm({ catalog, partnerOfferings }) {
  const dispatch = useDispatch();
  const offerings = useSelector(selectAllOfferings);
  const catalogOfferings = offerings
    .filter((offering) => offering.catalog === catalog)
    .map((offering) => offering.offering);
  const availableOfferings = partnerOfferings.filter(
    (offering) => !catalogOfferings.includes(offering.id),
  );
  const [offeringId, setOfferingId] = useState('');

  const onCourseChange = (e) => setOfferingId(e.target.value);

  const onAddCourseClicked = () => dispatch(
    addOffering({ catalog, offering: offeringId }),
  );

  const options = availableOfferings.map((offering) => (
    <option key={offering.id} value={offering.id}>
      {offering.title}
    </option>
  ));

  return (
    <Form>
      <Form.Group>
        <Form.Label>Course</Form.Label>
        <Form.Control as="select" value={offeringId} onChange={onCourseChange}>
          <option value="">Select a course</option>
          {options}
        </Form.Control>
      </Form.Group>

      <Button type="button" onClick={onAddCourseClicked}>
        Add course
      </Button>
    </Form>
  );
}

AddOfferingForm.propTypes = {
  catalog: PropTypes.string.isRequired,
  partnerOfferings: PropTypes.arrayOf(PropTypes.string).isRequired,
};
