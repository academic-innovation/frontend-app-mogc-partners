import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActionRow, Button, Container, Form, ModalDialog, Stack, useToggle,
} from '@edx/paragon';
import { Add } from '@edx/paragon/icons';

import { fetchPartners, selectPartnerById } from './partnersSlice';
import ResponsiveBreadcrumb from '../../common/ResponsiveBreadcrumb';
import CatalogList from '../catalogs/CatalogList';
import { addCatalog } from '../catalogs/catalogsSlice';
import ManagementMenu from './ManagementMenu';

export default function PartnerDetails() {
  const dispatch = useDispatch();
  const { partnerSlug } = useParams();
  const partnersStatus = useSelector((state) => state.partners.status);
  const partner = useSelector((state) => selectPartnerById(state, partnerSlug));
  const [isOpen, open, close] = useToggle(false);
  const [name, setName] = useState('');

  const onNameChanged = (e) => setName(e.target.value);

  const canCreateCatalog = name.length > 0;
  const createCatalog = async () => {
    if (canCreateCatalog) {
      try {
        await dispatch(addCatalog({ name, partner: partnerSlug }));
        setName('');
        close();
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    }
  };

  useEffect(() => {
    if (partnersStatus === 'idle') {
      dispatch(fetchPartners());
    }
  }, [partnersStatus, dispatch]);

  return (
    <>
      <section className="px-3 py-5 bg-primary">
        <Container size="lg">
          <Stack direction="horizontal" gap={3} className="justify-content-between">
            <h1 className="text-white">{partner?.name}</h1>
            <ManagementMenu partner={partnerSlug} />
          </Stack>
        </Container>
      </section>

      <section className="p-3 py-5">
        <Container size="lg">
          <ResponsiveBreadcrumb
            links={[
              { label: 'Partners', url: '' },
              { label: partner?.name, url: `/${partnerSlug}` },
            ]}
            activeLabel="Catalogs"
          />
          <h2>Available Catalogs</h2>
          <CatalogList partnerSlug={partnerSlug} />
          <div>
            <Button iconBefore={Add} onClick={open}>Add catalog</Button>
          </div>
        </Container>
      </section>

      <ModalDialog
        title="Add new catalog"
        isOpen={isOpen}
        onClose={close}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>Add new catalog</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Form>
            <Form.Group>
              <Form.Label>Catalog name</Form.Label>
              <Form.Control value={name} onChange={onNameChanged} />
            </Form.Group>
          </Form>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button onClick={createCatalog} disabled={!canCreateCatalog}>
              Create
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}
