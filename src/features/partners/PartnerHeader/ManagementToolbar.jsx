import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ButtonLink from '../../../common/ButtonLink';
import ButtonLinkGroup from '../../../common/ButtonLinkGroup';

import { useRouteContext } from '../../../common/RouteContext';

const navButtonStyle = ({ isActive }) => `btn ${isActive ? 'btn-dark' : 'btn-outline-dark'}`;

export default function ManagementToolbar({ partner, showPreview }) {
  const { sharedState, setSharedState } = useRouteContext();

  const togglePreview = () => setSharedState({ isPreview: !sharedState.isPreview });

  return (
    <div className="row">
      <div className="col d-flex flex-column flex-sm-row justify-content-between gap-4">
        <ButtonLinkGroup>
          <NavLink className={navButtonStyle} to={`/${partner}/admin`} end>
            Cohorts
          </NavLink>
          <NavLink className={navButtonStyle} to={`/${partner}/admin/insights`}>
            Insights
          </NavLink>
        </ButtonLinkGroup>

        {showPreview && (
        <ButtonLink className="btn btn-primary" link={`/${partner}/details`} onClick={togglePreview}>
          Preview As Learner
        </ButtonLink>
        )}
      </div>
    </div>
  );
}

ManagementToolbar.defaultProps = {
  showPreview: false,
};

ManagementToolbar.propTypes = {
  partner: PropTypes.string.isRequired,
  showPreview: PropTypes.bool,
};
