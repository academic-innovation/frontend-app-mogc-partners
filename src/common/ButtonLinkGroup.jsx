import React from 'react';
import PropTypes from 'prop-types';

export default function ButtonLinkGroup({ children, ...props }) {
  return (
    <div className="btn-group btn-group-md" {...props}>
      {children}
    </div>
  );
}

ButtonLinkGroup.defaultProps = {
  children: {},
};

ButtonLinkGroup.propTypes = {
  children: PropTypes.node,
};
