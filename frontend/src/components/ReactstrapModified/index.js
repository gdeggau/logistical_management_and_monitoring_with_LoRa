import React from "react";
import { Input, Label } from "reactstrap";
import { darken } from "polished";

// import { Container } from './styles';

export function InputStyled({ ...rest }) {
  const { disabled } = rest;
  return (
    <Input
      {...rest}
      bsSize="sm"
      style={{
        backgroundColor: disabled ? darken(0.2, "#fff") : "#fff",
      }}
    />
  );
}

export function LabelStyled({ ...rest }) {
  return <Label {...rest} size="sm" style={{ color: "#fff" }} />;
}

// &::placeholder {
//   color: rgba(255, 255, 255, 0.7);
// }
