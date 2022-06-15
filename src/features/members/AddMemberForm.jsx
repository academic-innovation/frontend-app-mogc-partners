import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Form } from '@edx/paragon';
import { addMember } from './membersSlice';

export default function AddMemberForm({ catalog }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const onEmailChange = (e) => setEmail(e.target.value);

  const onAddMemberClick = async () => {
    await dispatch(addMember({ catalog, email }));
    setEmail('');
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={onEmailChange}
        />
      </Form.Group>
      <Button type="button" onClick={onAddMemberClick}>
        Add member
      </Button>
    </Form>
  );
}

AddMemberForm.propTypes = {
  catalog: PropTypes.string.isRequired,
};
