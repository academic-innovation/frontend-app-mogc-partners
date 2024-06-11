import React from 'react';
import PropTypes from 'prop-types';

import { PageBanner } from '@openedx/paragon';

export default function AlertBanner({ children, ...props }) {
  return <PageBanner {...props}>{children}</PageBanner>;
}

AlertBanner.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
