import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from '@edx/paragon';
import { NavLink } from 'react-router-dom';

export default function ManagementToolbar({ partner }) {
  return (
    <div className="row">
      <div className="col col-9">
        <ButtonToolbar>
          <ButtonGroup>
            <Button>
              <NavLink to={`/${partner}/admin`} style={{ color: 'white' }}>Admin</NavLink>
            </Button>
            <Button>
              <NavLink to={`/${partner}/admin/insights`} style={{ color: 'red' }}>Insights</NavLink>
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      <div className="col col-3">
        <Button>
          <NavLink to={`/${partner}`}>Manage</NavLink>
        </Button>
      </div>
    </div>
  );
}

ManagementToolbar.propTypes = {
  partner: PropTypes.string.isRequired,
};
