import React from "react";
import PropTypes from "prop-types";

import { Wrapper, Content } from "./styles";

//children sao elementos que ficam dentro da <AuthLayout> <children> <AuthLayout/>
function CreateWrapper({ children }) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

CreateWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default CreateWrapper;
