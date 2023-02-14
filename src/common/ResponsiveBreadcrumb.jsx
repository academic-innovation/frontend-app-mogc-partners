import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, breakpoints, useMediaQuery } from '@edx/paragon';

import useBasepath from './useBasepath';

export default function ResponsiveBreadcrumb({ links, ...props }) {
  const { addBasepath } = useBasepath();
  const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });

  // TODO: We can just use react-router's <Link> after a future Paragon upgrade.
  // See: https://paragon-openedx.netlify.app/components/breadcrumb/#with-custom-link-element
  const newLinks = links.map(
    link => ({ label: link.label, url: addBasepath(link.url) }),
  );
  return (
    <Breadcrumb
      {...props}
      links={newLinks}
      isMobile={isSmall}
    />
  );
}

ResponsiveBreadcrumb.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
};
