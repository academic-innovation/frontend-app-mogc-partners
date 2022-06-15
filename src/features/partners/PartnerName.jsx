import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectPartnerById } from './partnersSlice';

export default function PartnerName({ slug }) {
  const partner = useSelector((state) => selectPartnerById(state, slug));
  return <span>{partner?.name ?? ''}</span>;
}

PartnerName.propTypes = {
  slug: PropTypes.string.isRequired,
};
