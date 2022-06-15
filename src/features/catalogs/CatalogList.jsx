import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCatalogs, selectAllCatalogs } from './catalogsSlice';
import CatalogListItem from './CatalogListItem';

export default function CatalogList({ partnerSlug }) {
  const dispatch = useDispatch();
  const catalogs = useSelector(selectAllCatalogs);
  const catalogsStatus = useSelector(state => state.catalogs.status);

  useEffect(() => {
    if (catalogsStatus === 'idle') {
      dispatch(fetchCatalogs());
    }
  }, [catalogsStatus, dispatch]);

  const catalogItems = catalogs
    .filter(catalog => catalog.partner === partnerSlug)
    .map(catalog => (
      <CatalogListItem key={catalog.uuid} uuid={catalog.uuid} />
    ));

  return (
    <>
      {catalogItems}
    </>
  );
}

CatalogList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
};
