import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, Content } from './styles';

// import { Container } from './styles';

// children sao elementos que ficam dentro da <AuthLayout> <children> <AuthLayout/>
function AuthLayout({ children }) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthLayout;
