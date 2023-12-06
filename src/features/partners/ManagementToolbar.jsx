import React from 'react';
import PropTypes from 'prop-types';
import ButtonLink from '../../common/ButtonLink';
import ButtonLinkGroup from '../../common/ButtonLinkGroup';

export default function ManagementToolbar({ partner, selectedTab }) {
  const btnGroup = [
    { text: 'Cohorts', link: `/${partner}/admin`, props: { className: selectedTab === 'cohorts' ? 'btn btn-dark' : 'btn btn-outline-dark' } },
    { text: 'Insights', link: `/${partner}/admin/insights`, props: { className: selectedTab === 'insights' ? 'btn btn-dark' : 'btn btn-outline-dark' } },
  ];
  return (
    <div className="row">
      <div className="col col-9">
        <ButtonLinkGroup links={btnGroup} />
      </div>
      <div className="col col-3">
        <ButtonLink className="btn btn-primary" link={`/${partner}`} text="Preview As Learner" />
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
