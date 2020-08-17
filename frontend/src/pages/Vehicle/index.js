import React from "react";
import api from "~/services/api";

import Header from "~/components/Header";

import { Container, Content } from "./styles";

function Vehicle() {
  return (
    <>
      {/* <Header /> */}
      <Container>
        <Content>
          <h1>Vehicle</h1>
          <button>Cadastrar</button>
        </Content>
      </Container>
    </>
  );
}

export default Vehicle;
