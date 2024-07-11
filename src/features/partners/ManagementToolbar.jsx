import React from 'react';
import PropTypes from 'prop-types';
import ButtonLink from '../../common/ButtonLink';
import ButtonLinkGroup from '../../common/ButtonLinkGroup';

import { useRouteContext } from '../../common/RouteContext';

export default function ManagementToolbar({ partner, selected }) {
  const { sharedState, setSharedState } = useRouteContext();

  const togglePreview = () => setSharedState({ isPreview: !sharedState.isPreview });

  const options = ['insights', 'cohorts'];
  const selectedOpt = selected === null ? false : options[Number(selected)];
  const cohortClass = `btn btn-${selectedOpt === options[1] ? 'dark' : 'outline-dark'}`;
  const insightClass = `btn btn-${selectedOpt === options[0] ? 'dark' : 'outline-dark'}`;
  return (
    <div className="row">
      <div className="col col-9">
        <ButtonLinkGroup>
          <ButtonLink className={cohortClass} link={`/${partner}/admin`}>
            Cohorts
          </ButtonLink>
          <ButtonLink className={insightClass} link={`/${partner}/admin/insights`}>
            Insights
          </ButtonLink>
        </ButtonLinkGroup>
      </div>
      <div className="col col-3">
        <ButtonLink className="btn btn-primary" link={`/${partner}/details`} onClick={togglePreview}>
          Preview As Learner
        </ButtonLink>
      </div>
    </div>
  );
}

ManagementToolbar.defaultProps = {
  selected: null,
};

ManagementToolbar.propTypes = {
  partner: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};
