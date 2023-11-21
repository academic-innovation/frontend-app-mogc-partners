import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@edx/paragon';
import { Link } from 'react-router-dom';

function MenuLink({ to, children }) {
  return <Link to={to} className="dropdown-item" role="button">{children}</Link>;
}

function TabLink({ to, title, children }) {
  return <Tab to={to} className="dropdown-item">{children}</Tab>;
}

export default function ManagementTabs({ partner }) {
  return (
    <Tabs
      defaultActiveKey="hello"
      id="uncontrolled-pills-tab-example"
      variant="button-group"
    >
      <TabLink to={`/${partner}/admin/`} eventKey="hello" title="Hello">Hello there</TabLink>
      <TabLink to={`/${partner}/admin/`} eventKey="yep" title="Correct">Hello there</TabLink>
    </Tabs>
  );
}

TabLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

MenuLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ManagementTabs.propTypes = {
  partner: PropTypes.string.isRequired,
};
