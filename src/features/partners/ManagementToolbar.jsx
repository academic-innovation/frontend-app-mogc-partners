import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from '@edx/paragon';
import { Link } from 'react-router-dom';

export default function ManagementToolbar({ partner, selectedTab }) {
  return (
    <div className="row">
      <div className="col col-9">
        <ButtonToolbar>
          <ButtonGroup>
            <Button as={Link} to={`/${partner}/admin`} className={{ background: selectedTab === 'cohorts' ? 'red' : 'white' }}>
              Cohorts
            </Button>
            <Button as={Link} to={`/${partner}/admin/insights`} className={{ background: selectedTab === 'insights' ? 'red' : 'white' }}>
              Insights
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      <div className="col col-3">
        <Button as={Link} to={`/${partner}`}>
          Preview As Learner
        </Button>
      </div>
    </div>
  );
}

ManagementToolbar.defaultProps = {
  selectedTab: null,
};

ManagementToolbar.propTypes = {
  partner: PropTypes.string.isRequired,
  selectedTab: PropTypes.string,
};
