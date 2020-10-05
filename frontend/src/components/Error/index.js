import React from "react";
import styled from "styled-components";
import { ErrorMessage } from "formik";

const ErrorStyle = styled.div`
  padding-top: 5px;
  color: #ff3333;
`;

export default function Error({ name }) {
  return (
    <ErrorMessage name={name}>
      {(msg) => <ErrorStyle>{msg}</ErrorStyle>}
    </ErrorMessage>
  );
}
