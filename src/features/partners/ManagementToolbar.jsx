import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from '@edx/paragon';
import { NavLink } from 'react-router-dom';

export default function ManagementToolbar({ partner }) {
  const url = new URL(window.location);
  const isInsights = url.pathname.includes('insights');
  return (
    <div className="row">
      <div className="col col-9">
        <ButtonToolbar>
          <ButtonGroup>
            <Button style={{ background: !isInsights ? 'red' : 'white' }}>
              <NavLink to={`/${partner}/admin`} style={{ color: !isInsights ? 'red' : 'white' }}>
                Cohorts
              </NavLink>
            </Button>
            <Button style={{ background: isInsights ? 'red' : 'white' }}>
              <NavLink to={`/${partner}/admin/insights`} style={{ color: isInsights ? 'red' : 'white' }}>Insights</NavLink>
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      <div className="col col-3">
        <Button>
          <NavLink to={`/${partner}`}>Preview As Learner</NavLink>
        </Button>
      </div>
    </div>
  );
}

ManagementToolbar.propTypes = {
  partner: PropTypes.string.isRequired,
};
