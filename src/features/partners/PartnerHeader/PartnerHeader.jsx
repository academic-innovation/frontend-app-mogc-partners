import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Container, Button } from '@openedx/paragon';

import { Link } from 'react-router-dom';
import usePartner from '../usePartner';

import ResponsiveBreadcrumb from './ResponsiveBreadcrumb';
import ManagementToolbar from './ManagementToolbar';
import PartnerHeading from './PartnerHeading';
import AlertBanner from '../../../common/AlertBanner';
import { useRouteContext } from '../../../common/RouteContext';

export default function PartnerHeader({ selectedView, activeLabel }) {
  const [partner, partnerSlug, partnersStatus] = usePartner();
  const { sharedState, setSharedState } = useRouteContext();
  const { isPreview } = sharedState;

  const PAGE_HEADER_SETTINGS = {
    cohortDetail: {
      showViewButton: true,
      breadcrumbLinks: [
        { label: 'Partners', url: '/' },
        { label: partner?.name, url: `/${partnerSlug}` },
        { label: 'Cohorts', url: `/${partnerSlug}/admin` },
      ],
    },
    partnerAdmin: {
      showViewButton: true,
      breadcrumbLinks: [
        { label: 'Partners', url: '/' },
        { label: partner?.name, url: `/${partnerSlug}/details` },
      ],
    },
    partnerStats: {
      showViewButton: true,
      breadcrumbLinks: [
        { label: 'Partners', url: '/' },
        { label: partner?.name, url: `/${partnerSlug}/details` },
      ],
    },
    partnerDetails: {
      showViewButton: false,
      breadcrumbLinks: [
        { label: 'Partners', url: '/' },
      ],
    },
  };

  const viewSettings = PAGE_HEADER_SETTINGS[selectedView];
  viewSettings.showPreview = selectedView === 'cohortDetail';

  const togglePreview = () => setSharedState({ isPreview: !sharedState.isPreview });

  if (partnersStatus !== 'fulfilled') {
    return <Spinner animation="border" className="mie-3" screenReaderText="loading" />;
  }

  return (
    <>
      {isPreview && (
        <AlertBanner
          variant="accentB"
          dismissible
          onDismiss={togglePreview}
        >
          You are viewing this page as a learner.
        </AlertBanner>
      )}

      <PartnerHeading partnerName={partner?.name}>
        {viewSettings.showViewButton && (
          <Button variant="inverse-outline-primary" as={Link} to={`/${partnerSlug}/details`}>View</Button>
        )}
      </PartnerHeading>

      <section className="p-3">
        <Container size="lg">
          <ResponsiveBreadcrumb
            links={viewSettings.breadcrumbLinks}
            activeLabel={activeLabel}
          />

          {(partner?.isManager && !isPreview) && (
            <ManagementToolbar
              partner={partnerSlug}
              showPreview={viewSettings.showPreview}
            />
          )}
        </Container>
      </section>
    </>
  );
}

PartnerHeader.propTypes = {
  activeLabel: PropTypes.string.isRequired,
  selectedView: PropTypes.string.isRequired,
};
