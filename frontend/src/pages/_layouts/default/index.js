import React from "react";
import PropTypes from "prop-types";

import Header from "~/components/Header";
import MenuLeft from "~/components/MenuLeft";

import { Wrapper } from "./styles";

import { Container } from "reactstrap";

// import { Container } from './styles';

//children sao elementos que ficam dentro da <AuthLayout> <children> <AuthLayout/>
function DefaultLayout({ children }) {
  return (
    <Wrapper>
      <MenuLeft />
      <Container fluid={true} style={{ padding: "0", overflow: "auto" }}>
        <Header />
        {children}
      </Container>
    </Wrapper>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DefaultLayout;
