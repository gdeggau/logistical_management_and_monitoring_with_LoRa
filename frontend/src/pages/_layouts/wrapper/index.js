import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

// import { Wrapper, Content } from "./styles";

// children sao elementos que ficam dentro da <AuthLayout> <children> <AuthLayout/>
function Wrapper({ fluid, children, maxWidth }) {
  return (
    // <Wrapper>
    // <Content>{children}</Content>
    <Container
      fluid
      style={{
        padding: '10px 15px',
        maxWidth,
      }}
    >
      <Container
        fluid={fluid}
        style={{
          background: '#343a40',
          borderRadius: '4px',
          padding: '15px 15px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {children}
      </Container>
    </Container>
    // </Wrapper>
  );
}

Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
  fluid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  maxWidth: PropTypes.string,
};

Wrapper.defaultProps = {
  fluid: true,
  maxWidth: null,
};

export default Wrapper;
