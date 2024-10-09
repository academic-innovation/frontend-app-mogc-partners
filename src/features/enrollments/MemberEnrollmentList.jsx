import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { DataTable, DropdownFilter, TextFilter } from '@openedx/paragon';
import { selectAllOfferings } from '../offerings/offeringsSlice';
import EntityContext from '../../common/EntityContext';
import useRecords from './useRecords';
import useOfferings from '../offerings/useOfferings';

import { getCohortFilterOptions } from '../../utils/forms';

function memberEnrollments(user) {
  return enrollment => enrollment.user === user;
}

function memberCompletions(user) {
  return enrollment => (
    enrollment.isComplete && enrollment.user === user
  );
}

function availableOfferings(memberCohorts, cohortOfferingsMap) {
  const allAvailableOfferings = memberCohorts.reduce((memberOfferings, cohort) => (
    memberOfferings.concat(cohortOfferingsMap[cohort])
  ), []);
  return new Set(allAvailableOfferings).size;
}

export default function MemberEnrollmentList({ partnerSlug, offerings, cohorts }) {
  const [enrollments, enrollmentsStatus] = useRecords();
  const [partnerOfferings] = useOfferings(selectAllOfferings);
  const courseKeys = offerings.map(offering => offering.details.courseKey);
  const offeringEnrollments = enrollments.filter(
    enrollment => courseKeys.includes(enrollment.offering.courseKey),
  );

  const cohortOfferingsMap = partnerOfferings.reduce((offeringsMap, offering) => {
    const offeringKey = offering.cohort;
    if (Object.keys(offeringsMap).includes(offeringKey)) {
      offeringsMap[offeringKey].push(offering.details.courseKey);
    } else {
      offeringsMap[offeringKey] = [offering.details.courseKey];
    }
    return offeringsMap;
  }, {});

  const { entities } = useContext(EntityContext);
  const partnerMembers = entities.filter(
    member => member.partner === partnerSlug,
  );
  const membersMap = partnerMembers.reduce((members, member) => {
    if (Object.keys(members).includes(member.email)) {
      members[member.email].cohorts.push(member.cohort);
    } else {
      members[member.email] = {
        name: member.name,
        email: member.email,
        cohorts: [member.cohort],
        enrollments: offeringEnrollments.filter(memberEnrollments(member.user)).length,
        completions: offeringEnrollments.filter(memberCompletions(member.user)).length,
      };
    }
    return members;
  }, {});

  const data = Object.keys(membersMap).map(memberEmail => {
    const memberData = membersMap[memberEmail];
    return {
      ...memberData,
      offerings: availableOfferings(memberData.cohorts, cohortOfferingsMap),
    };
  });

  const cohortFilterOptions = getCohortFilterOptions(cohorts);

  return (
    <DataTable
      isFilterable
      isPaginated
      isLoading={enrollmentsStatus !== 'success'}
      enableHiding
      initialState={{ pageSize: 20, hiddenColumns: ['cohorts'] }}
      defaultColumnValues={{ Filter: TextFilter }}
      numBreakoutFilters={2}
      data={data}
      itemCount={data.length}
      columns={[
        {
          Header: 'Filter by cohort',
          accessor: 'cohorts',
          Filter: DropdownFilter,
          filter: 'includes',
          filterChoices: cohortFilterOptions,
        },
        { Header: 'Name', accessor: 'name', disableFilters: true },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Courses', accessor: 'offerings', disableFilters: true },
        { Header: 'Enrollments', accessor: 'enrollments', disableFilters: true },
        { Header: 'Completions', accessor: 'completions', disableFilters: true },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content="No members found." />
      <DataTable.TableFooter />
    </DataTable>
  );
}

MemberEnrollmentList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
  offerings: PropTypes.arrayOf(PropTypes.shape({
    cohort: PropTypes.string,
    continueLearningUrl: PropTypes.string,
    details: PropTypes.shape({
      courseKey: PropTypes.string,
      description: PropTypes.string,
      shortDescription: PropTypes.string,
      title: PropTypes.string,
    }),
    id: PropTypes.number,
    isEnrolled: PropTypes.bool,
    offering: PropTypes.number,
    partner: PropTypes.string,
  })).isRequired,
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    partner: PropTypes.string,
    uuid: PropTypes.string,
  })).isRequired,
};
