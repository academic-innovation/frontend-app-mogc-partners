import React from 'react';
import PropTypes from 'prop-types';

import StatCard from '../partners/StatCard';
import useMembers from './useMembers';

export default function MemberStatsCard({ partner }) {
  const [members, status] = useMembers();
  if (status !== 'success') {
    return <StatCard value="--" unit="Members" />;
  }
  const partnerMembers = members.filter(member => member.partner === partner);
  const partnerMemberEmails = new Set(partnerMembers.map(member => member.email));
  const memberTotal = partnerMemberEmails.size;
  const unit = memberTotal === 1 ? 'Learner' : 'Learners';

  return <StatCard value={partnerMemberEmails.size} unit="Total" secondary={unit} />;
}

MemberStatsCard.propTypes = {
  partner: PropTypes.string.isRequired,
};
