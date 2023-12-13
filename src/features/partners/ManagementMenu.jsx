import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton } from '@edx/paragon';
import { Link } from 'react-router-dom';

// Implementation of <Dropdown.Item> using react-router <Link>...
function MenuLink({ to, children }) {
  return <Link to={to} className="dropdown-item" role="button">{children}</Link>;
}

export default function ManagementMenu({ partner }) {
  return (
    <DropdownButton variant="inverse-outline-primary" id="management-menu" title="Manage">
      <MenuLink to={`/${partner}/admin`}>Cohorts</MenuLink>
      <MenuLink to={`/${partner}/admin/insights`}>Insights</MenuLink>
      <MenuLink to={`/${partner}/details`}>Learner view</MenuLink>
    </DropdownButton>
  );
}

MenuLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ManagementMenu.propTypes = {
  partner: PropTypes.string.isRequired,
};
