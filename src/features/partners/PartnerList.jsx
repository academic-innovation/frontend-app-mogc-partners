import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';
import { Container } from '@edx/paragon';
import { fetchPartners, selectAllPartners } from './partnersSlice';

export default function PartnerList() {
  const { config } = useContext(AppContext);
  const dispatch = useDispatch();
  const partners = useSelector(selectAllPartners);
  const partnersStatus = useSelector((state) => state.partners.status);
  useEffect(() => {
    if (partnersStatus === 'idle') {
      dispatch(fetchPartners());
    }
  }, [partnersStatus, dispatch]);

  const partnerLinks = partners.map(
    (partner) => <li><Link to={`/${partner.slug}`}>{partner.name}</Link></li>,
  );

  return (
    <section className="px-3 py-5">
      <Container size="lg">
        <p>
          Select a partner to view, or go directly
          to <a href={`${config.LMS_BASE_URL}`}>Michigan Online Global Classroom</a>.
        </p>
        <ul>
          {partnerLinks}
        </ul>
      </Container>
    </section>
  );
}
