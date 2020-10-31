import React from 'react';
import PropTypes from 'prop-types';

import { Container } from 'reactstrap';
import Header from '~/components/Header';
import MenuLeft from '~/components/MenuLeft';
import { Wrapper } from './styles';

// import { Container } from './styles';

// children sao elementos que ficam dentro da <AuthLayout> <children> <AuthLayout/>
function DefaultLayout({ children }) {
  return (
    <div style={{ height: '100%' }}>
      <Header />
      <Wrapper>
        <MenuLeft />
        <Container
          fluid
          style={{ padding: '0', overflow: 'auto', display: 'flex' }}
        >
          {children}
        </Container>
      </Wrapper>
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DefaultLayout;
