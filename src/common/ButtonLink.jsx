import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function ButtonLink({ link, text, ...props }) {
  return (
    <Link {...props} to={link}>{text}</Link>
  );
}

ButtonLink.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
