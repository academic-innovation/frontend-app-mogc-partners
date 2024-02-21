import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function ButtonLink({ link, children, ...props }) {
  return (
    <Link {...props} to={link}>{children}</Link>
  );
}

ButtonLink.propTypes = {
  link: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
