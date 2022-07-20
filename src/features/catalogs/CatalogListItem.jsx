import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  ActionRow, Alert, Card, Button, Form, ModalDialog, useToggle,
} from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import { selectCatalogById, deleteCatalog, updateCatalog } from './catalogsSlice';

import CatalogMemberCount from '../members/CatalogMemberCount';
import CatalogOfferingCount from '../offerings/CatalogOfferingCount';

export default function CatalogListItem({ uuid }) {
  const dispatch = useDispatch();
  const catalog = useSelector(state => selectCatalogById(state, uuid));
  const [catalogName, setCatalogName] = useState(catalog.name);
  const [catalogConfirmation, setCatalogConfirmation] = useState('');
  const [isOpen, open, close] = useToggle(false);
  const [deleteIsOpen, openDelete, closeDelete] = useToggle(false);

  const onCatalogDeletionConfirmed = () => {
    dispatch(deleteCatalog(uuid));
    setCatalogConfirmation('');
    closeDelete();
  };

  const onCatalogNameChanged = (e) => setCatalogName(e.target.value);

  const onCatalogConfirmationChanged = (e) => setCatalogConfirmation(e.target.value);

  const canDelete = catalogConfirmation === catalog.name;

  const onUpdateSubmitted = async () => {
    await dispatch(
      updateCatalog({
        uuid, catalogUpdates: { partner: catalog.partner, name: catalogName },
      }),
    );
    close();
  };

  return (
    <>
      <Card orientation="horizontal" className="mb-4">
        <Card.Section>
          <h3>{catalog.name}</h3>
          <p>
            <CatalogOfferingCount catalog={catalog.uuid} />{' '}
            <CatalogMemberCount catalog={catalog.uuid} />
          </p>
        </Card.Section>
        <Card.Footer className="justify-content-end w-auto">
          <Link
            to={`/${catalog.partner}/admin/catalog/${catalog.uuid}`}
            className="btn btn-primary"
          >
            View
          </Link>
          <Button variant="secondary" onClick={open}>Rename</Button>
          <Button variant="outline-danger" onClick={openDelete}>Delete</Button>
        </Card.Footer>
      </Card>

      <ModalDialog
        title="Delete catalog"
        isOpen={deleteIsOpen}
        onClose={closeDelete}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Delete {catalog.name}
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          <Alert variant="danger" icon={Info}>
            <Alert.Heading>Warning: This is a destructive action!</Alert.Heading>
            <p>
              Deleting a catalog is permanent,
              and deletes all memberships and offerings within the catalog.
            </p>
          </Alert>

          <p>Please type <strong>{catalog.name}</strong> to confirm.</p>

          <Form>
            <Form.Group>
              <Form.Control
                type="text"
                value={catalogConfirmation}
                onChange={onCatalogConfirmationChanged}
                aria-label="Type in the name of the catalog to confirm that you want to delete this catalog."
              />
            </Form.Group>
          </Form>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button
              onClick={onCatalogDeletionConfirmed}
              variant="danger"
              disabled={!canDelete}
            >
              Delete
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>

      <ModalDialog
        title="Edit this!"
        isOpen={isOpen}
        onClose={close}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Rename {catalog.name}
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          <Form>
            <Form.Group>
              <Form.Label>Catalog Name</Form.Label>
              <Form.Control
                type="text"
                value={catalogName}
                onChange={onCatalogNameChanged}
              />
            </Form.Group>
          </Form>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button onClick={onUpdateSubmitted}>
              Submit
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

CatalogListItem.propTypes = {
  uuid: PropTypes.string.isRequired,
};
