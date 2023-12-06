import React from 'react';
import PropTypes from 'prop-types';
import ButtonLink from '../../common/ButtonLink';
import ButtonLinkGroup from '../../common/ButtonLinkGroup';

export default function ManagementToolbar({ partner, selectedTab }) {
  return (
    <div className="row">
      <div className="col col-9">
        <ButtonLinkGroup>
          <ButtonLink className={selectedTab === 'cohorts' ? 'btn btn-dark' : 'btn btn-outline-dark'} link={`/${partner}/admin`}>
            Cohorts
          </ButtonLink>
          <ButtonLink className={selectedTab === 'insights' ? 'btn btn-dark' : 'btn btn-outline-dark'} link={`/${partner}/admin/insights`}>
            Insights
          </ButtonLink>
        </ButtonLinkGroup>
      </div>
      <div className="col col-3">
        <ButtonLink className="btn btn-primary" link={`/${partner}`}>
          Preview As Learner
        </ButtonLink>
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
