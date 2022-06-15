import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Form } from '@edx/paragon';
import { addCatalog } from './catalogsSlice';

export default function AddCatalogForm({ partnerSlug }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const onNameChanged = (e) => setName(e.target.value);
  const canSave = name.length > 0;
  const onCreateCatalogClicked = async () => {
    if (canSave) {
      try {
        await dispatch(addCatalog({ name, partner: partnerSlug }));
        setName('');
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    }
  };

  return (
    <Form>
      <Form.Group>
        <Form.Control type="text" floatingLabel="name" value={name} onChange={onNameChanged} />
      </Form.Group>

      <Button onClick={onCreateCatalogClicked}>Create catalog</Button>
    </Form>
  );
}

AddCatalogForm.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
