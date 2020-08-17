import React from "react";
import PropTypes from "prop-types";

import Header from "~/components/Header";
import MenuLeft from "~/components/MenuLeft";

import { Wrapper, Content } from "./styles";

// import { Container } from './styles';

//children sao elementos que ficam dentro da <AuthLayout> <children> <AuthLayout/>
function DefaultLayout({ children }) {
  return (
    <Wrapper>
      <MenuLeft />
      <Content>
        <Header />
        {children}
      </Content>
    </Wrapper>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DefaultLayout;
