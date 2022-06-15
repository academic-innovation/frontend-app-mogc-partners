import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPartners, selectAllPartners } from './partnersSlice';

export default function PartnerList() {
  const dispatch = useDispatch();
  const partners = useSelector(selectAllPartners);
  const partnersStatus = useSelector((state) => state.partners.status);
  useEffect(() => {
    if (partnersStatus === 'idle') {
      dispatch(fetchPartners());
    }
  }, [partnersStatus, dispatch]);

  const postItems = partners.map((post) => <p>Post: {post.name}</p>);
  return (
    <section>
      <p>Some partners will go here.</p>
      {postItems}
    </section>
  );
}
