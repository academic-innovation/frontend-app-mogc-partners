import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Breadcrumb, breakpoints, useMediaQuery } from '@edx/paragon';

export default function ResponsiveBreadcrumb({ links, ...props }) {
  const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });

  const newLinks = links.map(
    link => ({ label: link.label, to: link.url }),
  );
  return (
    <Breadcrumb
      {...props}
      links={newLinks}
      linkAs={Link}
      isMobile={isSmall}
    />
  );
}

ResponsiveBreadcrumb.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    href: PropTypes.string,
  })).isRequired,
};
