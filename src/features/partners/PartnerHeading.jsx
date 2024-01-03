import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Container } from '@edx/paragon';

export default function PartnerHeading({ partnerName, children }) {
  return (
    <>
      <section className="px-3 py-5 bg-primary hello">
        <Container size="lg">
          <Stack direction="horizontal" gap={3} className="justify-content-between">
            <h1 className="text-white">{partnerName}</h1>
            {children}
          </Stack>
          <p className="text-white">
            Welcome! We are very excited to offer this learning opportunity
            through a collaboration with the University of Michigan.
          </p>
        </Container>
      </section>
    </>
  );
}

PartnerHeading.defaultProps = {
  children: [],
};

PartnerHeading.propTypes = {
  partnerName: PropTypes.string.isRequired,
  children: PropTypes.node,
  partnerName: '',
};
