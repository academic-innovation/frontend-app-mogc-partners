import React from 'react';
import PropTypes from 'prop-types';
import ButtonLink from './ButtonLink';

export default function ButtonLinkGroup({ links, ...props }) {
  return (
    <div className="btn-group btn-group-md" {...props}>
      {links.map(link => (
        <ButtonLink {...link.props} link={link.link} text={link.text} />
      ))}
    </div>
  );
}

ButtonLinkGroup.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
};
