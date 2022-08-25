import React from 'react';
import { Breadcrumb, breakpoints, useMediaQuery } from '@edx/paragon';

export default function ResponsiveBreadcrumb(props) {
  const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
  return (
    <Breadcrumb
      {...props}
      isMobile={isSmall}
    />
  );
}
